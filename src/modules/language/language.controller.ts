import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'

import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { MessageResDto } from 'src/shared/dtos/response.dto'
import type { AccessTokenPayload } from 'src/shared/types/jwt.type'

import {
  CreateLanguageBodyDto,
  CreateLanguageResDto,
  GetAllLanguagesResDto,
  GetLanguageDetailResDto,
  LanguageIdParamDto,
  UpdateLanguageBodyDto,
  UpdateLanguageResDto,
} from './dto/language.dto'
import { LanguageService } from './language.service'

@Controller('languages')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Get()
  @ZodSerializerDto(GetAllLanguagesResDto)
  findAll() {
    return this.languageService.findAll()
  }

  @Get(':languageId')
  @ZodSerializerDto(GetLanguageDetailResDto)
  findOne(@Param() params: LanguageIdParamDto) {
    return this.languageService.findOne(params.languageId)
  }

  @Post()
  @ZodSerializerDto(CreateLanguageResDto)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: CreateLanguageBodyDto, @ActiveUser() user: AccessTokenPayload) {
    return this.languageService.create(body, user.userId)
  }

  @Put(':languageId')
  @ZodSerializerDto(UpdateLanguageResDto)
  update(
    @Param() params: LanguageIdParamDto,
    @Body() body: UpdateLanguageBodyDto,
    @ActiveUser() user: AccessTokenPayload,
  ) {
    return this.languageService.update(params.languageId, body, user.userId)
  }

  @Delete(':languageId')
  @ZodSerializerDto(MessageResDto)
  remove(@Param() params: LanguageIdParamDto) {
    return this.languageService.remove(params.languageId)
  }
}
