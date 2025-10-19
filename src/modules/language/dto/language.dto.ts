import { createZodDto } from 'nestjs-zod'

import {
  CreateLanguageBodySchema,
  LanguageIdParamSchema,
  UpdateLanguageBodySchema,
} from '../model/language-request.model'
import type {
  CreateLanguageResType,
  GetAllLanguagesResType,
  GetLanguageDetailResType,
  UpdateLanguageResType,
} from '../model/language-response.model'
import {
  CreateLanguageResSchema,
  GetAllLanguagesResSchema,
  GetLanguageDetailResSchema,
  UpdateLanguageResSchema,
} from '../model/language-response.model'

// Request DTOs
export class CreateLanguageBodyDto extends createZodDto(CreateLanguageBodySchema) {}

export class UpdateLanguageBodyDto extends createZodDto(UpdateLanguageBodySchema) {}

export class LanguageIdParamDto extends createZodDto(LanguageIdParamSchema) {}

// Response DTOs
export class GetAllLanguagesResDto extends createZodDto(GetAllLanguagesResSchema) {}

export class GetLanguageDetailResDto extends createZodDto(GetLanguageDetailResSchema) {}

export class CreateLanguageResDto extends createZodDto(CreateLanguageResSchema) {}

export class UpdateLanguageResDto extends createZodDto(UpdateLanguageResSchema) {}

// Export types for convenience
export type { CreateLanguageResType, GetAllLanguagesResType, GetLanguageDetailResType, UpdateLanguageResType }
