import z from 'zod'

export const emptyBodySchema = z.object({}).strict()

export type EmptyBodyType = z.infer<typeof emptyBodySchema>

// ==================== Pagination Query Schema ====================
// Reusable pagination query schema for GET requests
export const PaginationQuerySchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/, 'Page must be a positive number')
    .default('1')
    .transform(Number)
    .refine((val) => val >= 1, 'Page must be at least 1'),
  limit: z
    .string()
    .regex(/^\d+$/, 'Limit must be a positive number')
    .default('10')
    .transform(Number)
    .refine((val) => val >= 1 && val <= 100, 'Limit must be between 1 and 100'),
})

export type PaginationQueryType = z.infer<typeof PaginationQuerySchema>

// ==================== ID Param Schema Factory ====================
// Factory function to create type-safe ID param schemas
export const createIdParamSchema = (paramName: string, entityName: string) => {
  return z.object({
    [paramName]: z.string().regex(/^\d+$/, `${entityName} ID must be a number`).transform(Number),
  })
}

// Factory function for string-based ID params (like Language ID)
export const createStringIdParamSchema = (paramName: string, entityName: string) => {
  return z.object({
    [paramName]: z.string().min(1, `${entityName} ID is required`),
  })
}

// Common ID param schemas
export const RoleIdParamSchema = createIdParamSchema('roleId', 'Role')
export const PermissionIdParamSchema = createIdParamSchema('permissionId', 'Permission')
export const LanguageIdParamSchema = createStringIdParamSchema('languageId', 'Language')

export type RoleIdParamType = z.infer<typeof RoleIdParamSchema>
export type PermissionIdParamType = z.infer<typeof PermissionIdParamSchema>
export type LanguageIdParamType = z.infer<typeof LanguageIdParamSchema>
