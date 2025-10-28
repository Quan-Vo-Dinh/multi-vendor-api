import z from 'zod'

import {
  PaginationQuerySchema,
  type PaginationQueryType,
  PermissionIdParamSchema,
  type PermissionIdParamType,
} from 'src/shared/models/request.model'

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

// Re-export shared schemas for backward compatibility
export { PaginationQuerySchema, PermissionIdParamSchema, type PaginationQueryType, type PermissionIdParamType }
