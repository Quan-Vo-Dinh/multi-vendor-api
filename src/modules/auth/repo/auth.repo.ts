import { Injectable } from '@nestjs/common'

import { RegisterBodyType, UserType } from 'src/modules/auth/model/auth.model'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(
    user: Omit<RegisterBodyType, 'confirmPassword'> & Pick<UserType, 'roleId'>,
  ): Promise<Omit<UserType, 'password' | 'otpSecret'>> {
    return this.prismaService.user.create({
      data: user,
      omit: { password: true, otpSecret: true },
    })
  }
}
