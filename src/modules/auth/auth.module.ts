import { Module } from '@nestjs/common'

import { AuthRepository } from 'src/modules/auth/repo/auth.repo'
import { RolesService } from 'src/modules/auth/roles.service'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  controllers: [AuthController],
  providers: [AuthService, RolesService, AuthRepository],
})
export class AuthModule {}
