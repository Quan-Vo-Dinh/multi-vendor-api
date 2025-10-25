import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'

import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { MessageResDto } from 'src/shared/dtos/response.dto'
import type { AccessTokenPayload } from 'src/shared/types/jwt.type'

import {
  CreatePermissionBodyDto,
  CreatePermissionResDto,
  GetAllPermissionsResDto,
  GetPermissionDetailResDto,
  PaginationQueryDto,
  PermissionIdParamDto,
  UpdatePermissionBodyDto,
  UpdatePermissionResDto,
} from './dto/permission.dto'
import { PermissionService } from './permission.service'

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @ZodSerializerDto(GetAllPermissionsResDto)
  findAll(@Query() query: PaginationQueryDto) {
    return this.permissionService.findAll(query)
  }

  @Get(':permissionId')
  @ZodSerializerDto(GetPermissionDetailResDto)
  findOne(@Param() params: PermissionIdParamDto) {
    return this.permissionService.findOne(params.permissionId)
  }

  @Post()
  @ZodSerializerDto(CreatePermissionResDto)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: CreatePermissionBodyDto, @ActiveUser() user: AccessTokenPayload) {
    return this.permissionService.create(body, user.userId)
  }

  @Put(':permissionId')
  @ZodSerializerDto(UpdatePermissionResDto)
  update(
    @Param() params: PermissionIdParamDto,
    @Body() body: UpdatePermissionBodyDto,
    @ActiveUser() user: AccessTokenPayload,
  ) {
    return this.permissionService.update(params.permissionId, body, user.userId)
  }

  @Delete(':permissionId')
  @ZodSerializerDto(MessageResDto)
  remove(@Param() params: PermissionIdParamDto, @ActiveUser() user: AccessTokenPayload) {
    return this.permissionService.remove(params.permissionId, user.userId)
  }
}
