import { createZodDto } from 'nestjs-zod'

import {
  BrandIdParamSchema,
  BrandTranslationIdParamSchema,
  CreateBrandBodySchema,
  CreateBrandTranslationBodySchema,
  PaginationQuerySchema,
  UpdateBrandBodySchema,
  UpdateBrandTranslationBodySchema,
} from '../model/brand-request.model'
import {
  CreateBrandResSchema,
  CreateBrandTranslationResSchema,
  GetAllBrandsResSchema,
  GetBrandDetailResSchema,
  GetBrandTranslationDetailResSchema,
  UpdateBrandResSchema,
  UpdateBrandTranslationResSchema,
} from '../model/brand-response.model'

// ==================== Brand Request DTOs ====================
export class CreateBrandBodyDto extends createZodDto(CreateBrandBodySchema) {}
export class UpdateBrandBodyDto extends createZodDto(UpdateBrandBodySchema) {}
export class BrandIdParamDto extends createZodDto(BrandIdParamSchema) {}
export class PaginationQueryDto extends createZodDto(PaginationQuerySchema) {}

// ==================== Brand Response DTOs ====================
export class GetAllBrandsResDto extends createZodDto(GetAllBrandsResSchema) {}
export class GetBrandDetailResDto extends createZodDto(GetBrandDetailResSchema) {}
export class CreateBrandResDto extends createZodDto(CreateBrandResSchema) {}
export class UpdateBrandResDto extends createZodDto(UpdateBrandResSchema) {}

// ==================== BrandTranslation Request DTOs ====================
export class CreateBrandTranslationBodyDto extends createZodDto(CreateBrandTranslationBodySchema) {}
export class UpdateBrandTranslationBodyDto extends createZodDto(UpdateBrandTranslationBodySchema) {}
export class BrandTranslationIdParamDto extends createZodDto(BrandTranslationIdParamSchema) {}

// ==================== BrandTranslation Response DTOs ====================
export class GetBrandTranslationDetailResDto extends createZodDto(GetBrandTranslationDetailResSchema) {}
export class CreateBrandTranslationResDto extends createZodDto(CreateBrandTranslationResSchema) {}
export class UpdateBrandTranslationResDto extends createZodDto(UpdateBrandTranslationResSchema) {}
