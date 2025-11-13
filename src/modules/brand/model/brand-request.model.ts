import z from 'zod'

import { createIdParamSchema } from 'src/shared/models/request.model'

// ==================== Brand Schemas ====================

// Create Brand Request Schema
export const CreateBrandBodySchema = z.object({
  name: z.string().min(1, 'Name is required').max(500, 'Name must be at most 500 characters'),
  logo: z.string().min(1, 'Logo is required').max(1000, 'Logo URL must be at most 1000 characters'),
})

export type CreateBrandBodyType = z.infer<typeof CreateBrandBodySchema>

// Update Brand Request Schema
export const UpdateBrandBodySchema = z.object({
  name: z.string().min(1, 'Name is required').max(500, 'Name must be at most 500 characters').optional(),
  logo: z.string().min(1, 'Logo is required').max(1000, 'Logo URL must be at most 1000 characters').optional(),
})

export type UpdateBrandBodyType = z.infer<typeof UpdateBrandBodySchema>

// Brand ID Param Schema
export const BrandIdParamSchema = createIdParamSchema('brandId', 'Brand')

export type BrandIdParamType = z.infer<typeof BrandIdParamSchema>

// ==================== BrandTranslation Schemas ====================

// Create BrandTranslation Request Schema
export const CreateBrandTranslationBodySchema = z.object({
  languageId: z.string().min(1, 'Language ID is required').max(10, 'Language ID must be at most 10 characters'),
  name: z.string().min(1, 'Name is required').max(500, 'Name must be at most 500 characters'),
  description: z.string().min(1, 'Description is required'),
})

export type CreateBrandTranslationBodyType = z.infer<typeof CreateBrandTranslationBodySchema>

// Update BrandTranslation Request Schema
export const UpdateBrandTranslationBodySchema = z.object({
  name: z.string().min(1, 'Name is required').max(500, 'Name must be at most 500 characters').optional(),
  description: z.string().min(1, 'Description is required').optional(),
})

export type UpdateBrandTranslationBodyType = z.infer<typeof UpdateBrandTranslationBodySchema>

// BrandTranslation ID Param Schema
export const BrandTranslationIdParamSchema = createIdParamSchema('brandTranslationId', 'BrandTranslation')

export type BrandTranslationIdParamType = z.infer<typeof BrandTranslationIdParamSchema>

// Re-export PaginationQuerySchema for convenience
export { PaginationQuerySchema, type PaginationQueryType } from 'src/shared/models/request.model'
