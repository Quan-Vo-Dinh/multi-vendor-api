import { Module } from '@nestjs/common'

import { AuthRepository } from 'src/modules/auth/repo/auth.repo'
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repo'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, SharedUserRepository],
})
export class AuthModule {}
