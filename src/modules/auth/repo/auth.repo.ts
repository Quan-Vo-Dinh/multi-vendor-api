import { Injectable } from '@nestjs/common'

import {
  DeviceType,
  RefreshTokenType,
  RegisterBodyType,
  RoleType,
  VerificationCodeType,
} from 'src/modules/auth/model/auth.model'
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

  async createRefreshToken(data: { userId: number; refreshToken: string; expiresAt: Date; deviceId: number }) {
    return this.prismaService.refreshToken.create({
      data: {
        userId: data.userId,
        token: data.refreshToken,
        expiresAt: data.expiresAt,
        deviceId: data.deviceId,
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

  async findUniqueRefreshTokenIncludeUserRole(uniqueObject: {
    token: string
  }): Promise<(RefreshTokenType & { user: UserType & { role: RoleType } }) | null> {
    return this.prismaService.refreshToken.findUnique({
      where: uniqueObject,
      include: {
        user: {
          include: {
            role: true,
          },
        },
      },
    })
  }

  async updateDevice(deviceId: number, data: Partial<DeviceType>) {
    return this.prismaService.device.update({
      where: { id: deviceId },
      data,
    })
  }

  async findRefreshToken(uniqueObject: { token: string }): Promise<RefreshTokenType> {
    return this.prismaService.refreshToken.findUniqueOrThrow({
      where: uniqueObject,
    })
  }

  async deleteRefreshToken(uniqueObject: { token: string }) {
    return this.prismaService.refreshToken.delete({
      where: uniqueObject,
    })
  }
}
