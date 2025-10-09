import { Injectable } from '@nestjs/common'

import { DeviceType, RegisterBodyType, RoleType, VerificationCodeType } from 'src/modules/auth/model/auth.model'
import { TypeofVerificationCode } from 'src/shared/constants/auth.constant'
import { UserType } from 'src/shared/models/shared-user.model'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(
    user: Omit<RegisterBodyType, 'confirmPassword' | 'code'> & Pick<UserType, 'roleId'>,
  ): Promise<Omit<UserType, 'password' | 'otpSecret'>> {
    return this.prismaService.user.create({
      data: user,
      omit: { password: true, otpSecret: true },
    })
  }

  async createVerificationCode(verificationCode: Pick<VerificationCodeType, 'email' | 'code' | 'type' | 'expiresAt'>) {
    return this.prismaService.verificationCode.upsert({
      where: { email: verificationCode.email },
      create: verificationCode,
      update: {
        code: verificationCode.code,
        expiresAt: verificationCode.expiresAt,
      },
    })
  }

  async findVerificationCode(
    uniqueValue: { email: string } | { id: number } | { email: string; type: TypeofVerificationCode; code: string },
  ): Promise<VerificationCodeType | null> {
    return this.prismaService.verificationCode.findUnique({
      where: uniqueValue,
    })
  }

  async createRefreshToken(data: { userId: number; refreshToken: string; expiresAt: Date; deviceId: string }) {
    return this.prismaService.refreshToken.create({
      data: {
        userId: data.userId,
        token: data.refreshToken,
        expiresAt: data.expiresAt,
        deviceId: parseInt(data.deviceId),
      },
    })
  }

  createDevice(
    data: Pick<DeviceType, 'userId' | 'userAgent' | 'ip'> & Partial<Pick<DeviceType, 'lastActive' | 'isActive'>>,
  ) {
    return this.prismaService.device.create({
      data,
    })
  }

  async findUniqueIncludeRole(
    uniqueObject: { id: number } | { email: string },
  ): Promise<(UserType & { role: RoleType }) | null> {
    return this.prismaService.user.findUnique({
      where: uniqueObject,
      include: { role: true },
    })
  }
}
