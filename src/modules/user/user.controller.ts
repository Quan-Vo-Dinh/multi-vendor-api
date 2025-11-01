import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'

import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { MessageResDto } from 'src/shared/dtos/response.dto'
import type { AccessTokenPayload } from 'src/shared/types/jwt.type'

import {
  CreateUserBodyDto,
  CreateUserResDto,
  GetAllUsersResDto,
  GetUserDetailResDto,
  PaginationQueryDto,
  UpdateUserBodyDto,
  UpdateUserResDto,
  UserIdParamDto,
} from './dto/user.dto'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ZodSerializerDto(GetAllUsersResDto)
  findAll(@Query() query: PaginationQueryDto) {
    return this.userService.findAll(query)
  }

  @Get(':userId')
  @ZodSerializerDto(GetUserDetailResDto)
  findOne(@Param() params: UserIdParamDto) {
    return this.userService.findOne(params.userId)
  }

  @Post()
  @ZodSerializerDto(CreateUserResDto)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: CreateUserBodyDto, @ActiveUser() user: AccessTokenPayload) {
    return this.userService.create(body, user.userId)
  }

  @Put(':userId')
  @ZodSerializerDto(UpdateUserResDto)
  update(@Param() params: UserIdParamDto, @Body() body: UpdateUserBodyDto, @ActiveUser() user: AccessTokenPayload) {
    return this.userService.update(params.userId, body, user.userId)
  }

  @Delete(':userId')
  @ZodSerializerDto(MessageResDto)
  remove(@Param() params: UserIdParamDto, @ActiveUser() user: AccessTokenPayload) {
    return this.userService.remove(params.userId, user.userId)
  }
}
