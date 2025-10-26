import { Module } from '@nestjs/common'

import { RoleRepository } from './repo/role.repo'
import { RoleController } from './role.controller'
import { RoleService } from './role.service'

@Module({
  controllers: [RoleController],
  providers: [RoleService, RoleRepository],
  exports: [RoleService, RoleRepository],
})
export class RoleModule {}
