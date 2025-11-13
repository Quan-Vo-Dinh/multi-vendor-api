import z from 'zod'

import { createDataResponseSchema, createPaginatedResponseSchema } from 'src/shared/models/response.model'

import { BrandTranslationEntitySchema, BrandWithTranslationsSchema } from './brand-entity.model'

// ==================== Brand Responses ====================

// Get All Brands Response Schema (with pagination and translations)
export const GetAllBrandsResSchema = createPaginatedResponseSchema(BrandWithTranslationsSchema)

export type GetAllBrandsResType = z.infer<typeof GetAllBrandsResSchema>

// Get Brand Detail Response Schema (includes translations)
export const GetBrandDetailResSchema = createDataResponseSchema(BrandWithTranslationsSchema)

export type GetBrandDetailResType = z.infer<typeof GetBrandDetailResSchema>

// Create Brand Response Schema (includes translations - initially empty array)
export const CreateBrandResSchema = createDataResponseSchema(BrandWithTranslationsSchema)

export type CreateBrandResType = z.infer<typeof CreateBrandResSchema>

// Update Brand Response Schema (includes translations)
export const UpdateBrandResSchema = createDataResponseSchema(BrandWithTranslationsSchema)

export type UpdateBrandResType = z.infer<typeof UpdateBrandResSchema>

// ==================== BrandTranslation Responses ====================

// Get BrandTranslation Detail Response Schema
export const GetBrandTranslationDetailResSchema = createDataResponseSchema(BrandTranslationEntitySchema)

export type GetBrandTranslationDetailResType = z.infer<typeof GetBrandTranslationDetailResSchema>

// Create BrandTranslation Response Schema
export const CreateBrandTranslationResSchema = createDataResponseSchema(BrandTranslationEntitySchema)

export type CreateBrandTranslationResType = z.infer<typeof CreateBrandTranslationResSchema>

// Update BrandTranslation Response Schema
export const UpdateBrandTranslationResSchema = createDataResponseSchema(BrandTranslationEntitySchema)

export type UpdateBrandTranslationResType = z.infer<typeof UpdateBrandTranslationResSchema>
