import z from 'zod'

import { HTTPMethodSchema } from './permission-enum.model'

// Create Permission Request Schema
export const CreatePermissionBodySchema = z.object({
  name: z.string().min(1, 'Permission name is required').max(500, 'Permission name must be at most 500 characters'),
  description: z.string().max(5000).default(''),
  path: z.string().min(1, 'Permission path is required').max(1000, 'Permission path must be at most 1000 characters'),
  method: HTTPMethodSchema,
  module: z.string().max(500, 'Module name must be at most 500 characters').default(''),
})

export type CreatePermissionBodyType = z.infer<typeof CreatePermissionBodySchema>

// Update Permission Request Schema
export const UpdatePermissionBodySchema = z.object({
  name: z
    .string()
    .min(1, 'Permission name is required')
    .max(500, 'Permission name must be at most 500 characters')
    .optional(),
  description: z.string().optional(),
  path: z
    .string()
    .min(1, 'Permission path is required')
    .max(1000, 'Permission path must be at most 1000 characters')
    .optional(),
  method: HTTPMethodSchema.optional(),
  module: z.string().max(500, 'Module name must be at most 500 characters').optional(),
})

export type UpdatePermissionBodyType = z.infer<typeof UpdatePermissionBodySchema>

// Permission ID Param Schema
export const PermissionIdParamSchema = z.object({
  permissionId: z.string().regex(/^\d+$/, 'Permission ID must be a number').transform(Number),
})

export type PermissionIdParamType = z.infer<typeof PermissionIdParamSchema>

// Pagination Query Schema
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
