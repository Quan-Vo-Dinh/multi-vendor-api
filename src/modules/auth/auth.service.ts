import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common'
import { addMinutes } from 'date-fns'

import {
  LoginBodyType,
  RefreshTokenBodyType,
  RegisterBodyType,
  SendOtpBodyType,
} from 'src/modules/auth/model/auth.model'
import { AuthRepository } from 'src/modules/auth/repo/auth.repo'
import { RolesService } from 'src/modules/auth/roles.service'
import { envConfig } from 'src/shared/config'
import { TypeOfVerificationCode } from 'src/shared/constants/auth.constant'
import { generateRandomCode, isRecordNotFoundError, isUniqueConstraintPrismaError } from 'src/shared/helpers'
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repo'
import { EmailService } from 'src/shared/services/email.service'
import { HashingService } from 'src/shared/services/hashing.service'
import { TokenService } from 'src/shared/services/token.service'
import { AccessTokenPayloadCreate } from 'src/shared/types/jwt.type'

import {
  EmailAlreadyExistsException,
  EmailNotFoundException,
  FailedToSendOtpException,
  InvalidOtpException,
  InvalidPasswordException,
  OtpExpiredException,
} from './model/auth-error.model'

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly hashingService: HashingService,
    private readonly rolesService: RolesService,
    private readonly sharedUserRepository: SharedUserRepository,
    private readonly emailService: EmailService,
    private readonly tokenService: TokenService,
  ) {}

  async register(body: RegisterBodyType) {
    try {
      const verificationCode = await this.authRepository.findVerificationCode({
        email: body.email,
        type: TypeOfVerificationCode.REGISTER,
        code: body.code,
      })

      if (!verificationCode) {
        throw InvalidOtpException
      }

      if (verificationCode.expiresAt < new Date()) {
        throw OtpExpiredException
      }

      const clientRoleId = await this.rolesService.getClientRoleId()
      const hashedPassword = await this.hashingService.hash(body.password)

      return await this.authRepository.createUser({
        name: body.name,
        email: body.email,
        phoneNumber: body.phoneNumber,
        password: hashedPassword,
        roleId: clientRoleId,
      })
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw EmailAlreadyExistsException
      }
      throw error
    }
  }

  async sendOtp(body: SendOtpBodyType) {
    //1. check email or phone number exists
    const user = await this.sharedUserRepository.findUnique({ email: body.email })
    if (body.type === TypeOfVerificationCode.REGISTER && user) {
      throw EmailAlreadyExistsException
    }
    //2. generate otp
    const otpCode = generateRandomCode()

    await this.authRepository.createVerificationCode({
      code: otpCode,
      email: body.email,
      type: body.type,
      expiresAt: addMinutes(new Date(), parseInt(envConfig.OTP_EXPIRATION_MINUTES)),
    })
    //3. send otp to email or phone number
    const result = await this.emailService.sendOtp({ email: body.email, code: otpCode })
    if (result.error) {
      console.log(result.error)
      throw FailedToSendOtpException
    }
    return {
      message: 'OTP sent successfully',
      // verificationCodeId: verificationCode.id,
      // data: result.data,
      // error: result.error,
    }
  }

  async login(body: LoginBodyType & { userAgent: string; ip: string }) {
    const user = await this.authRepository.findUniqueIncludeRole({ email: body.email })

    if (!user) {
      throw EmailNotFoundException
    }

    const isPasswordValid = await this.hashingService.compare(body.password, user.password)

    if (!isPasswordValid) {
      throw InvalidPasswordException
    }
    const device = await this.authRepository.createDevice({
      userId: user.id,
      userAgent: body.userAgent,
      ip: body.ip,
      isActive: true,
      lastActive: new Date(),
    })
    console.log('---------------------------------device login:', device)

    const token = await this.generateTokens({
      userId: user.id,
      roleId: user.roleId,
      roleName: user.role.name,
      deviceId: device.id,
    })
    return token
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
}
