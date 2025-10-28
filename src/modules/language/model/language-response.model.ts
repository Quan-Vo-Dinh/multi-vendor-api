import z from 'zod'

import { createDataResponseSchema } from 'src/shared/models/response.model'

import { LanguageSchema } from './language-entity.model'

// Get All Languages Response Schema
// Note: Language module uses custom structure with totalItem instead of PaginationMeta
export const GetAllLanguagesResSchema = z.object({
  data: z.array(LanguageSchema),
  totalItem: z.number().int().min(0),
})

export type GetAllLanguagesResType = z.infer<typeof GetAllLanguagesResSchema>

// Get Language Detail Response Schema
export const GetLanguageDetailResSchema = createDataResponseSchema(LanguageSchema)

export type GetLanguageDetailResType = z.infer<typeof GetLanguageDetailResSchema>

// Create Language Response Schema
export const CreateLanguageResSchema = createDataResponseSchema(LanguageSchema)

export type CreateLanguageResType = z.infer<typeof CreateLanguageResSchema>

// Update Language Response Schema
export const UpdateLanguageResSchema = createDataResponseSchema(LanguageSchema)

export type UpdateLanguageResType = z.infer<typeof UpdateLanguageResSchema>
