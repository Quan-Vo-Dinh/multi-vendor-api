import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { addMinutes } from 'date-fns'

import {
  ForgotPasswordBodyType,
  LoginBodyType,
  LoginUnionResType,
  RefreshTokenBodyType,
  RegisterBodyType,
  SendOtpBodyType,
} from 'src/modules/auth/model/auth.model'
import { AuthRepository } from 'src/modules/auth/repo/auth.repo'
import { RolesService } from 'src/modules/auth/roles.service'
import type { EnvConfig } from 'src/shared/config'
import { TypeofVerificationCode, TypeOfVerificationCode } from 'src/shared/constants/auth.constant'
import { generateRandomCode, isRecordNotFoundError, isUniqueConstraintPrismaError } from 'src/shared/helpers'
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repo'
import { TwoFactorAuthService } from 'src/shared/services/2fa.service'
import { EmailService } from 'src/shared/services/email.service'
import { HashingService } from 'src/shared/services/hashing.service'
import { Temp2FAService } from 'src/shared/services/temp-2fa.service'
import { TokenService } from 'src/shared/services/token.service'
import { AccessTokenPayloadCreate } from 'src/shared/types/jwt.type'

import {
  EmailAlreadyExistsException,
  EmailNotFoundException,
  FailedToSendOtpException,
  InvalidOtpException,
  InvalidPasswordException,
  InvalidTempIdException,
  InvalidTempSessionException,
  InvalidTOTPTokenException,
  OtpExpiredException,
  TOTPAlreadyEnabledException,
  TOTPNotEnabledException,
} from './model/auth-error.model'

@Injectable()
export class AuthService {
  private readonly otpExpirationMinutes: number

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly hashingService: HashingService,
    private readonly rolesService: RolesService,
    private readonly sharedUserRepository: SharedUserRepository,
    private readonly emailService: EmailService,
    private readonly tokenService: TokenService,
    private readonly twoFactorAuthService: TwoFactorAuthService,
    private readonly temp2FAService: Temp2FAService,
    private readonly configService: ConfigService<EnvConfig>,
  ) {
    this.otpExpirationMinutes = this.configService.get('OTP_EXPIRATION_MINUTES', { infer: true }) ?? 5
  }

  async validateVerificationCode({ email, type }: { email: string; type: TypeofVerificationCode }) {
    const verificationCode = await this.authRepository.findUniqueVerificationCode({ email_type: { email, type } })
    if (!verificationCode) {
      throw InvalidOtpException
    }
    if (verificationCode.expiresAt < new Date()) {
      throw OtpExpiredException
    }
    return verificationCode
  }

  async register(body: RegisterBodyType) {
    try {
      await this.validateVerificationCode({
        email: body.email,
        type: TypeOfVerificationCode.REGISTER,
      })

      const clientRoleId = await this.rolesService.getClientRoleId()
      const hashedPassword = await this.hashingService.hash(body.password)

      const [user] = await Promise.all([
        this.authRepository.createUser({
          name: body.name,
          email: body.email,
          phoneNumber: body.phoneNumber,
          password: hashedPassword,
          roleId: clientRoleId,
        }),
        this.authRepository.deleteVerificationCode({
          email_type: { email: body.email, type: TypeOfVerificationCode.REGISTER },
        }),
      ])

      return user
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw EmailAlreadyExistsException
      }
      throw error
    }
  }

  async sendOtp(body: SendOtpBodyType) {
    let user: any = null
    let targetEmail: string

    // Handle different OTP types
    if (body.type === TypeOfVerificationCode.LOGIN_2FA) {
      // For 2FA, get user from temp session
      const tempSession = await this.temp2FAService.getTempSession(body.tempSessionId!)
      if (!tempSession) {
        throw InvalidTempSessionException
      }

      const userFromSession = await this.authRepository.findUniqueIncludeRole({ id: tempSession.userId })
      if (!userFromSession) {
        throw EmailNotFoundException
      }

      user = userFromSession
      targetEmail = userFromSession.email
    } else {
      // For other types, use provided email
      targetEmail = body.email!
      user = await this.sharedUserRepository.findUnique({ email: targetEmail })

      if (body.type === TypeOfVerificationCode.REGISTER && user) {
        throw EmailAlreadyExistsException
      }
      if (body.type === TypeOfVerificationCode.FORGOT_PASSWORD && !user) {
        throw EmailNotFoundException
      }
    }

    //2. generate otp
    const otpCode = generateRandomCode()
    const expiresAt =
      body.type === TypeOfVerificationCode.LOGIN_2FA
        ? new Date(Date.now() + 5 * 60 * 1000) // 5 minutes for 2FA
        : addMinutes(new Date(), this.otpExpirationMinutes) // default for others

    await this.authRepository.createVerificationCode({
      code: otpCode,
      email: targetEmail,
      type: body.type,
      expiresAt,
    })

    //3. send otp to email
    const result = await this.emailService.sendOtp({ email: targetEmail, code: otpCode })
    if (result.error) {
      console.log(result.error)
      throw FailedToSendOtpException
    }
    return {
      message: 'OTP sent successfully',
    }
  }

  async login(body: LoginBodyType & { userAgent: string; ip: string }): Promise<LoginUnionResType> {
    // Step 1: Validate username and password
    const user = await this.authRepository.findUniqueIncludeRole({ email: body.email })

    if (!user) {
      throw EmailNotFoundException
    }

    const isPasswordValid = await this.hashingService.compare(body.password, user.password)

    if (!isPasswordValid) {
      throw InvalidPasswordException
    }

    // Step 2: Check if user has 2FA enabled
    if (user.totpSecret) {
      // User has 2FA enabled - create temp session and require 2FA verification
      const tempSessionId = await this.temp2FAService.createTempSession(user.id)
      return { requires2FA: true, tempSessionId }
    }

    // Step 3: User doesn't have 2FA - issue tokens normally
    const device = await this.authRepository.createDevice({
      userId: user.id,
      userAgent: body.userAgent,
      ip: body.ip,
      isActive: true,
      lastActive: new Date(),
    })

    const tokens = await this.generateTokens({
      userId: user.id,
      roleId: user.roleId,
      roleName: user.role.name,
      deviceId: device.id,
    })

    return tokens
  }

  async generateTokens({ roleName, roleId, userId, deviceId }: AccessTokenPayloadCreate) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken({
        userId,
        deviceId,
        roleId,
        roleName,
      }),
      this.tokenService.signRefreshToken({ userId }),
    ])

    const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken)

    // Use transaction to ensure atomic operation
    await this.authRepository.createRefreshToken({
      userId,
      refreshToken,
      expiresAt: new Date(decodedRefreshToken.exp * 1000),
      deviceId: deviceId,
    })

    return { accessToken, refreshToken }
  }

  async refreshToken({ refreshToken, userAgent, ip }: RefreshTokenBodyType & { userAgent: string; ip: string }) {
    try {
      const { userId } = await this.tokenService.verifyRefreshToken(refreshToken) // verify token xem có hợp lệ không và lấy userId

      // Tìm token trong database, nếu không có tức đã bị revoke, throw nó ra
      const refreshTokenInDb = await this.authRepository.findUniqueRefreshTokenIncludeUserRole({
        token: refreshToken,
      })

      if (!refreshTokenInDb) {
        throw new UnauthorizedException('Refresh token has been revoked')
      }

      if (refreshTokenInDb.expiresAt < new Date()) {
        throw new UnauthorizedException('Refresh token has expired')
      }
      const {
        deviceId,
        user: {
          roleId,
          role: { name: roleName },
        },
      } = refreshTokenInDb

      const $updateDevice = this.authRepository.updateDevice(deviceId, {
        ip,
        userAgent,
      })

      // Xóa old refresh token sau khi tạo thành công token mới
      const $deleteOldRefreshToken = this.authRepository.deleteRefreshToken({ token: refreshToken })

      // Tạo mới access token và refresh token
      const $createNewTokens = this.generateTokens({ userId, roleId, roleName, deviceId })

      const [_, __, newTokens] = await Promise.all([$updateDevice, $deleteOldRefreshToken, $createNewTokens])
      return newTokens
    } catch (error) {
      console.log(error)
      if (error instanceof HttpException) {
        throw error
      }
      throw new UnauthorizedException('Invalid refresh token')
    }
  }

  async logout(refreshToken: string) {
    try {
      await this.tokenService.verifyRefreshToken(refreshToken)
      const storedToken = await this.authRepository.findRefreshToken({ token: refreshToken })

      if (storedToken.expiresAt < new Date()) {
        throw new UnauthorizedException('Refresh token has expired')
      }

      const deletedToken = await this.authRepository.deleteRefreshToken({ token: refreshToken })
      const deviceId = deletedToken.deviceId
      console.log('deletedToken:--------------------------------', deletedToken)
      await this.authRepository.updateDevice(deviceId, { isActive: false })

      return { message: 'Logged out successfully' }
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        console.log('check error', error)
        throw new UnauthorizedException('Refresh token has been revoked')
      }
      throw new UnauthorizedException()
    }
  }

  async forgotPassword(body: ForgotPasswordBodyType) {
    // 1. Check if user with the given email exists
    const user = await this.sharedUserRepository.findUnique({ email: body.email })
    if (!user) {
      throw EmailNotFoundException
    }

    // 2. Validate the OTP code
    await this.validateVerificationCode({
      email: body.email,
      type: TypeOfVerificationCode.FORGOT_PASSWORD,
    })

    // 3. Update the user's password & delete used OTP
    const hashedPassword = await this.hashingService.hash(body.newPassword)
    await Promise.all([
      this.authRepository.updateUser(user.id, { password: hashedPassword }),
      this.authRepository.deleteVerificationCode({
        email_type: { email: body.email, type: TypeOfVerificationCode.FORGOT_PASSWORD },
      }),
    ])

    // 4. Send success response
    return { message: 'Password has been reset successfully' }
  }

  async setupTwoFactorAuth(userId: number) {
    // 1. Check if user exists and 2FA not already enabled
    const user = await this.sharedUserRepository.findUnique({ id: userId })
    if (!user) throw EmailNotFoundException
    if (user.totpSecret) throw TOTPAlreadyEnabledException

    // 2. Generate TOTP secret and URI
    const { secret, uri } = this.twoFactorAuthService.generateTOTPSecret(user.email)

    // 3. Store secret temporarily in Redis with TTL 300s
    const tempId = await this.temp2FAService.createTempSecret(userId, secret)

    // 4. Return tempId, secret, and URI to client (secret only returned once here)
    return { tempId, secret, uri }
  }

  async activateTwoFactorAuth(userId: number, { tempId, token }: { tempId: string; token: string }) {
    // 1. Get temporary secret from cache
    const tempSecret = await this.temp2FAService.getTempSecret(tempId)
    if (!tempSecret || tempSecret.userId !== userId) {
      throw InvalidTempIdException
    }

    // 2. Get user and verify it exists
    const user = await this.sharedUserRepository.findUnique({ id: userId })
    if (!user) throw EmailNotFoundException

    // 3. Validate TOTP token with the temporary secret
    const isTokenValid = this.twoFactorAuthService.verifyTOTP({
      email: user.email,
      token,
      secretBase32: tempSecret.secret,
    })

    if (!isTokenValid) {
      throw InvalidTOTPTokenException
    }

    // 4. If valid, persist the secret to user's record and delete temp key
    await Promise.all([
      this.authRepository.updateUser(user.id, { totpSecret: tempSecret.secret }), // TODO: encrypt secret before storing (if existing helper present)
      this.temp2FAService.deleteTempSecret(tempId),
    ])

    return { success: true }
  }

  async verifyTwoFactorAuth(
    { tempSessionId, token, method = 'totp' }: { tempSessionId: string; token: string; method?: 'totp' | 'email' },
    { userAgent, ip }: { userAgent: string; ip: string },
  ) {
    // 1. Get temporary session from cache
    const tempSession = await this.temp2FAService.getTempSession(tempSessionId)
    if (!tempSession) {
      throw InvalidTempSessionException
    }

    // 2. Load user
    const user = await this.authRepository.findUniqueIncludeRole({ id: tempSession.userId })
    if (!user) {
      throw EmailNotFoundException
    }

    // 3. Validate token based on method
    let isTokenValid = false

    if (method === 'totp') {
      // For TOTP method, user must have totpSecret
      if (!user.totpSecret) {
        throw TOTPNotEnabledException
      }

      isTokenValid = this.twoFactorAuthService.verifyTOTP({
        email: user.email,
        token,
        secretBase32: user.totpSecret,
      })
    } else if (method === 'email') {
      // For email method, verify OTP code
      const verificationCode = await this.authRepository.findUniqueVerificationCode({
        email_type: {
          email: user.email,
          type: TypeOfVerificationCode.LOGIN_2FA,
        },
      })

      if (!verificationCode || verificationCode.code !== token) {
        isTokenValid = false
      } else {
        // Check if code is not expired (10 minutes = 600000ms)
        const expireAt = verificationCode.expiresAt.getTime()
        const now = new Date().getTime()
        const isExpired = now > expireAt
        if (isExpired) {
          throw OtpExpiredException
        }
        isTokenValid = true

        // Delete the used verification code
        if (isTokenValid) {
          await this.authRepository.deleteVerificationCode({ id: verificationCode.id })
        }
      }
    }

    if (!isTokenValid) {
      throw method === 'totp' ? InvalidTOTPTokenException : InvalidOtpException
    }

    // 4. Create device and generate tokens, then delete temp session
    const device = await this.authRepository.createDevice({
      userId: user.id,
      userAgent,
      ip,
      isActive: true,
      lastActive: new Date(),
    })

    const [tokens] = await Promise.all([
      this.generateTokens({
        userId: user.id,
        roleId: user.roleId,
        roleName: user.role.name,
        deviceId: device.id,
      }),
      this.temp2FAService.deleteTempSession(tempSessionId),
    ])

    return tokens
  }

  async disableTwoFactorAuth(userId: number, { token }: { token: string }) {
    // 1. Get user and verify they exist and have 2FA enabled
    const user = await this.sharedUserRepository.findUnique({ id: userId })
    if (!user || !user.totpSecret) {
      throw TOTPNotEnabledException
    }

    // 2. Verify TOTP token against stored secret
    const isTokenValid = this.twoFactorAuthService.verifyTOTP({
      email: user.email,
      token,
      secretBase32: user.totpSecret,
    })

    if (!isTokenValid) {
      throw InvalidTOTPTokenException
    }

    // 3. If valid, disable 2FA by setting totpSecret to null
    await this.authRepository.updateUser(user.id, { totpSecret: null })

    return { success: true }
  }
}
