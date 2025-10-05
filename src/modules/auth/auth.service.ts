import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { addMilliseconds } from 'date-fns'
import ms from 'ms'

import { RegisterBodyType, SendOtpBodyType } from 'src/modules/auth/model/auth.model'
import { AuthRepository } from 'src/modules/auth/repo/auth.repo'
import { RolesService } from 'src/modules/auth/roles.service'
import { envConfig } from 'src/shared/config'
import { TypeOfVerificationCode } from 'src/shared/constants/auth.constant'
import { generateRandomCode, isUniqueConstraintPrismaError } from 'src/shared/helpers'
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repo'
import { EmailService } from 'src/shared/services/email.service'
import { HashingService } from 'src/shared/services/hashing.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly hashingService: HashingService,
    private readonly rolesService: RolesService,
    private readonly sharedUserRepository: SharedUserRepository,
    private readonly emailService: EmailService,
  ) {}

  async register(body: RegisterBodyType) {
    try {
      const verificationCode = await this.authRepository.findVerificationCode({
        email: body.email,
        type: TypeOfVerificationCode.REGISTER,
        code: body.code,
      })

      if (!verificationCode) {
        throw new UnprocessableEntityException({
          message: 'Invalid verification code',
          path: ['code'],
        })
      }

      if (verificationCode.expiresAt < new Date()) {
        throw new UnprocessableEntityException({
          message: 'Verification code has expired',
        })
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
        throw new UnprocessableEntityException({
          field: 'email',
          message: 'Email already exists',
          path: ['email'],
        })
      }
      throw error
    }
  }

  async sendOtp(body: SendOtpBodyType) {
    //1. check email or phone number exists
    const user = await this.sharedUserRepository.findUnique({ email: body.email })
    if (body.type === TypeOfVerificationCode.REGISTER && user) {
      throw new UnprocessableEntityException({
        field: 'email',
        message: 'Email already exists',
        path: ['email'],
      })
    }
    //2. generate otp
    const otpCode = generateRandomCode()

    const verificationCode = await this.authRepository.createVerificationCode({
      code: otpCode,
      email: body.email,
      type: body.type,
      expiresAt: addMilliseconds(new Date(), ms(envConfig.OTP_EXPIRATION_MINUTES)),
    })
    //3. send otp to email or phone number
    const result = await this.emailService.sendOtp({ email: body.email, code: otpCode })
    if (result.error) {
      console.log(result.error)
      throw new UnprocessableEntityException({
        message: 'Failed to send OTP email',
        path: ['email'],
      })
    }
    return {
      message: 'OTP sent successfully',
      verificationCodeId: verificationCode.id,
      data: result.data,
      error: result.error,
    }
  }

  // async login(loginBodyDto: LoginBodyDto) {
  //   const user = await this.prismaService.user.findUnique({
  //     where: { email: loginBodyDto.email },
  //   })
  //
  //   if (!user) {
  //     throw new UnauthorizedException('Invalid email or password')
  //   }
  //
  //   const isPasswordValid = await this.hashingService.compare(loginBodyDto.password, user.password)
  //
  //   if (!isPasswordValid) {
  //     throw new UnprocessableEntityException({
  //       field: 'password',
  //       error: 'Invalid password',
  //     })
  //   }
  //   return this.generateTokens({ userId: user.id.toString() })
  // }
  //
  // async generateTokens(payload: { userId: string }) {
  //   const [accessToken, refreshToken] = await Promise.all([
  //     this.tokenService.signAccessToken(payload),
  //     this.tokenService.signRefreshToken(payload),
  //   ])
  //
  //   const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken)
  //
  //   // Use transaction to ensure atomic operation
  //   await this.prismaService.$transaction(async (prisma) => {
  //     // Delete any existing refresh tokens for this user to prevent accumulation
  //     await prisma.refreshToken.deleteMany({
  //       where: { userId: parseInt(payload.userId) },
  //     })
  //
  //     await prisma.refreshToken.create({
  //       data: {
  //         token: refreshToken,
  //         userId: parseInt(payload.userId),
  //         expiresAt: new Date(decodedRefreshToken.exp * 1000),
  //       },
  //     })
  //   })
  //
  //   return { accessToken, refreshToken }
  // }
  //
  // async refreshToken(refreshToken: string) {
  //   try {
  //     const { userId } = await this.tokenService.verifyRefreshToken(refreshToken) // verify token xem có hợp lệ không và lấy userId
  //
  //     // Tìm token trong database, nếu không có tức đã bị revoke, throw nó ra
  //     const storedToken = await this.prismaService.refreshToken.findUniqueOrThrow({
  //       where: { token: refreshToken },
  //     })
  //
  //     if (storedToken.expiresAt < new Date()) {
  //       throw new UnauthorizedException('Refresh token has expired')
  //     }
  //
  //     const newTokens = await this.generateTokens({ userId: userId.toString() })
  //
  //     // Xóa old refresh token sau khi tạo thành công token mới
  //     await this.prismaService.refreshToken.delete({
  //       where: { token: refreshToken },
  //     })
  //
  //     return newTokens
  //   } catch (error) {
  //     if (isRecordNotFoundError(error)) {
  //       throw new UnauthorizedException('Refresh token has been revoked')
  //     }
  //     throw new UnauthorizedException('Invalid refresh token')
  //   }
  // }
  //
  // async logout(refreshToken: string) {
  //   try {
  //     await this.tokenService.verifyRefreshToken(refreshToken) // verify token xem có hợp lệ không
  //
  //     // Tìm token trong database, nếu không có tức đã bị revoke, throw nó ra
  //     const storedToken = await this.prismaService.refreshToken.findUniqueOrThrow({
  //       where: { token: refreshToken },
  //     })
  //
  //     if (storedToken.expiresAt < new Date()) {
  //       throw new UnauthorizedException('Refresh token has expired')
  //     }
  //
  //     // Xóa refresh token khỏi database để logout
  //     await this.prismaService.refreshToken.delete({
  //       where: { token: refreshToken },
  //     })
  //     return { message: 'Logged out successfully' }
  //   } catch (error) {
  //     if (isRecordNotFoundError(error)) {
  //       throw new UnauthorizedException('Refresh token has been revoked')
  //     }
  //     throw new UnauthorizedException('Invalid refresh token')
  //   }
  // }
}
