import { ConflictException, Injectable } from '@nestjs/common'

import { RegisterBodyType, SendOtpBodyType } from 'src/modules/auth/model/auth.model'
import { AuthRepository } from 'src/modules/auth/repo/auth.repo'
import { RolesService } from 'src/modules/auth/roles.service'
import { isUniqueConstraintPrismaError } from 'src/shared/helpers'
import { HashingService } from 'src/shared/services/hashing.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly hashingService: HashingService,
    private readonly rolesService: RolesService,
  ) {}

  async register(body: RegisterBodyType) {
    try {
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
        throw new ConflictException('Email or phone number already exists')
      }
      throw error
    }
  }

  sendOtp(body: SendOtpBodyType) {
    return body
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
