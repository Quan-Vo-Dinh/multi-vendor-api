import { Injectable } from '@nestjs/common'

import { RegisterBodyType, VerificationCodeType } from 'src/modules/auth/model/auth.model'
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
}
