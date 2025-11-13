import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'

import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { MessageResDto } from 'src/shared/dtos/response.dto'
import type { AccessTokenPayload } from 'src/shared/types/jwt.type'

import { BrandService } from './brand.service'
import {
  BrandIdParamDto,
  BrandTranslationIdParamDto,
  CreateBrandBodyDto,
  CreateBrandResDto,
  CreateBrandTranslationBodyDto,
  CreateBrandTranslationResDto,
  GetAllBrandsResDto,
  GetBrandDetailResDto,
  GetBrandTranslationDetailResDto,
  PaginationQueryDto,
  UpdateBrandBodyDto,
  UpdateBrandResDto,
  UpdateBrandTranslationBodyDto,
  UpdateBrandTranslationResDto,
} from './dto/brand.dto'

@Controller()
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  // ==================== Brand Endpoints ====================

  @Get('brands')
  @ZodSerializerDto(GetAllBrandsResDto)
  findAllBrands(@Query() query: PaginationQueryDto) {
    return this.brandService.findAllBrands(query)
  }

  @Get('brands/:brandId')
  @ZodSerializerDto(GetBrandDetailResDto)
  findOneBrand(@Param() params: BrandIdParamDto) {
    return this.brandService.findOneBrand(params.brandId)
  }

  @Post('brands')
  @ZodSerializerDto(CreateBrandResDto)
  @HttpCode(HttpStatus.CREATED)
  createBrand(@Body() body: CreateBrandBodyDto, @ActiveUser() user: AccessTokenPayload) {
    return this.brandService.createBrand(body, user.userId)
  }

  @Put('brands/:brandId')
  @ZodSerializerDto(UpdateBrandResDto)
  updateBrand(
    @Param() params: BrandIdParamDto,
    @Body() body: UpdateBrandBodyDto,
    @ActiveUser() user: AccessTokenPayload,
  ) {
    return this.brandService.updateBrand(params.brandId, body, user.userId)
  }

  @Delete('brands/:brandId')
  @ZodSerializerDto(MessageResDto)
  removeBrand(@Param() params: BrandIdParamDto, @ActiveUser() user: AccessTokenPayload) {
    return this.brandService.removeBrand(params.brandId, user.userId)
  }

  // ==================== BrandTranslation Endpoints ====================

  @Post('brands/:brandId/translations')
  @ZodSerializerDto(CreateBrandTranslationResDto)
  @HttpCode(HttpStatus.CREATED)
  createBrandTranslation(
    @Param() params: BrandIdParamDto,
    @Body() body: CreateBrandTranslationBodyDto,
    @ActiveUser() user: AccessTokenPayload,
  ) {
    return this.brandService.createBrandTranslation(params.brandId, body, user.userId)
  }

  @Get('brand-translations/:brandTranslationId')
  @ZodSerializerDto(GetBrandTranslationDetailResDto)
  findOneBrandTranslation(@Param() params: BrandTranslationIdParamDto) {
    return this.brandService.findOneBrandTranslation(params.brandTranslationId)
  }

  @Put('brand-translations/:brandTranslationId')
  @ZodSerializerDto(UpdateBrandTranslationResDto)
  updateBrandTranslation(
    @Param() params: BrandTranslationIdParamDto,
    @Body() body: UpdateBrandTranslationBodyDto,
    @ActiveUser() user: AccessTokenPayload,
  ) {
    return this.brandService.updateBrandTranslation(params.brandTranslationId, body, user.userId)
  }

  @Delete('brand-translations/:brandTranslationId')
  @ZodSerializerDto(MessageResDto)
  removeBrandTranslation(@Param() params: BrandTranslationIdParamDto, @ActiveUser() user: AccessTokenPayload) {
    return this.brandService.removeBrandTranslation(params.brandTranslationId, user.userId)
  }
}
