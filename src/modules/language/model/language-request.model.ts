import z from 'zod'

// Create Language Request Schema
export const CreateLanguageBodySchema = z.object({
  id: z.string().min(1, 'Language ID is required').max(10, 'Language ID must be at most 10 characters'),
  name: z.string().min(1, 'Language name is required').max(500, 'Language name must be at most 500 characters'),
})

export type CreateLanguageBodyType = z.infer<typeof CreateLanguageBodySchema>

// Update Language Request Schema
export const UpdateLanguageBodySchema = z.object({
  name: z.string().min(1, 'Language name is required').max(500, 'Language name must be at most 500 characters'),
})

export type UpdateLanguageBodyType = z.infer<typeof UpdateLanguageBodySchema>

// Language ID Param Schema
export const LanguageIdParamSchema = z.object({
  languageId: z.string().min(1, 'Language ID is required'),
})

export type LanguageIdParamType = z.infer<typeof LanguageIdParamSchema>
