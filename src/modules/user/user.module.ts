import { Module } from '@nestjs/common'

import { SharedModule } from 'src/shared/shared.module'

import { UserRepository } from './repo/user.repo'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  imports: [SharedModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
