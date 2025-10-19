import z from 'zod'

import { LanguageSchema } from './language-entity.model'

// Get All Languages Response Schema
export const GetAllLanguagesResSchema = z.object({
  data: z.array(LanguageSchema),
  totalItem: z.number().int().min(0),
})

export type GetAllLanguagesResType = z.infer<typeof GetAllLanguagesResSchema>

// Get Language Detail Response Schema
export const GetLanguageDetailResSchema = z.object({
  data: LanguageSchema,
})

export type GetLanguageDetailResType = z.infer<typeof GetLanguageDetailResSchema>

// Create Language Response Schema
export const CreateLanguageResSchema = z.object({
  data: LanguageSchema,
})

export type CreateLanguageResType = z.infer<typeof CreateLanguageResSchema>

// Update Language Response Schema
export const UpdateLanguageResSchema = z.object({
  data: LanguageSchema,
})

export type UpdateLanguageResType = z.infer<typeof UpdateLanguageResSchema>
