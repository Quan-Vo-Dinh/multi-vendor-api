import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'

import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { MessageResDto } from 'src/shared/dtos/response.dto'
import type { AccessTokenPayload } from 'src/shared/types/jwt.type'

import {
  CreateRoleBodyDto,
  CreateRoleResDto,
  GetAllRolesResDto,
  GetRoleDetailResDto,
  PaginationQueryDto,
  RoleIdParamDto,
  UpdateRoleBodyDto,
  UpdateRoleResDto,
} from './dto/role.dto'
import { RoleService } from './role.service'

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @ZodSerializerDto(GetAllRolesResDto)
  findAll(@Query() query: PaginationQueryDto) {
    return this.roleService.findAll(query)
  }

  @Get(':roleId')
  @ZodSerializerDto(GetRoleDetailResDto)
  findOne(@Param() params: RoleIdParamDto) {
    return this.roleService.findOne(params.roleId)
  }

  @Post()
  @ZodSerializerDto(CreateRoleResDto)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: CreateRoleBodyDto, @ActiveUser() user: AccessTokenPayload) {
    return this.roleService.create(body, user.userId)
  }

  @Put(':roleId')
  @ZodSerializerDto(UpdateRoleResDto)
  update(@Param() params: RoleIdParamDto, @Body() body: UpdateRoleBodyDto, @ActiveUser() user: AccessTokenPayload) {
    return this.roleService.update(params.roleId, body, user.userId)
  }

  @Delete(':roleId')
  @ZodSerializerDto(MessageResDto)
  remove(@Param() params: RoleIdParamDto, @ActiveUser() user: AccessTokenPayload) {
    return this.roleService.remove(params.roleId, user.userId)
  }
}
