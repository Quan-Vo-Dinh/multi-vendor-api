import { Injectable } from '@nestjs/common'
import type { Prisma } from '@prisma/client'

import type { DeviceType, RefreshTokenType, RoleType, VerificationCodeType } from 'src/modules/auth/model/auth.model'
import { TypeofVerificationCode } from 'src/shared/constants/auth.constant'
import type { UserType } from 'src/shared/models/shared-user.model'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  createUser(user: Prisma.UserCreateInput): Promise<Omit<UserType, 'password' | 'totpSecret'>> {
    return this.prismaService.user.create({
      data: user,
      omit: { password: true, totpSecret: true },
    })
  }

  createVerificationCode(payload: Pick<VerificationCodeType, 'email' | 'code' | 'type' | 'expiresAt'>) {
    return this.prismaService.verificationCode.upsert({
      where: { email_type: { email: payload.email, type: payload.type } },
      create: payload,
      update: { code: payload.code, expiresAt: payload.expiresAt },
    })
  }

  findUniqueVerificationCode(
    uniqueValue: { id: number } | { email_type: { email: string; type: TypeofVerificationCode } },
  ): Promise<VerificationCodeType | null> {
    return this.prismaService.verificationCode.findUnique({
      where: uniqueValue,
    })
  }

  createRefreshToken(data: { userId: number; refreshToken: string; expiresAt: Date; deviceId: number }) {
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

  findUniqueIncludeRole(
    uniqueObject: { id: number } | { email: string },
  ): Promise<(UserType & { role: RoleType }) | null> {
    return this.prismaService.user.findUnique({
      where: uniqueObject,
      include: { role: true },
    })
  }

  findUniqueRefreshTokenIncludeUserRole(uniqueObject: {
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

  updateDevice(deviceId: number, data: Prisma.DeviceUpdateInput) {
    return this.prismaService.device.update({
      where: { id: deviceId },
      data,
    })
  }

  findRefreshToken(uniqueObject: { token: string }): Promise<RefreshTokenType> {
    return this.prismaService.refreshToken.findUniqueOrThrow({
      where: uniqueObject,
    })
  }

  deleteRefreshToken(uniqueObject: { token: string }) {
    return this.prismaService.refreshToken.delete({
      where: uniqueObject,
    })
  }

  updateUser(userId: number, data: Prisma.UserUpdateInput): Promise<UserType> {
    return this.prismaService.user.update({
      where: { id: userId },
      data,
    })
  }

  deleteVerificationCode(
    uniqueValue: { id: number } | { email_type: { email: string; type: TypeofVerificationCode } },
  ) {
    return this.prismaService.verificationCode.delete({
      where: uniqueValue,
    })
  }
}
