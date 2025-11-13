import z from 'zod'

// Brand Entity Schema (without sensitive fields)
export const BrandEntitySchema = z.object({
  id: z.number().int(),
  name: z.string(),
  logo: z.string(),
  createdById: z.number().int().nullable(),
  updatedById: z.number().int().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type BrandEntityType = z.infer<typeof BrandEntitySchema>

// BrandTranslation Entity Schema
export const BrandTranslationEntitySchema = z.object({
  id: z.number().int(),
  brandId: z.number().int(),
  languageId: z.string(),
  name: z.string(),
  description: z.string(),
  createdById: z.number().int().nullable(),
  updatedById: z.number().int().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type BrandTranslationEntityType = z.infer<typeof BrandTranslationEntitySchema>

// Brand with Translations (for detail view and list view)
export const BrandWithTranslationsSchema = BrandEntitySchema.extend({
  brandTranslations: z.array(BrandTranslationEntitySchema),
})

export type BrandWithTranslationsType = z.infer<typeof BrandWithTranslationsSchema>
