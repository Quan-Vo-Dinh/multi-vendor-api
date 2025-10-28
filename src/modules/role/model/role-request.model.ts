import z from 'zod'

import {
  PaginationQuerySchema,
  type PaginationQueryType,
  RoleIdParamSchema,
  type RoleIdParamType,
} from 'src/shared/models/request.model'

// Create Role Request Schema
export const CreateRoleBodySchema = z.object({
  name: z.string().min(1, 'Role name is required').max(500, 'Role name must be at most 500 characters'),
  description: z.string().max(5000).default(''),
  isActive: z.boolean().default(true),
  permissionIds: z.array(z.number().int()).default([]),
})

export type CreateRoleBodyType = z.infer<typeof CreateRoleBodySchema>

// Update Role Request Schema
export const UpdateRoleBodySchema = z.object({
  name: z.string().min(1, 'Role name is required').max(500, 'Role name must be at most 500 characters').optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  permissionIds: z.array(z.number().int()).optional(),
})

export type UpdateRoleBodyType = z.infer<typeof UpdateRoleBodySchema>

// Re-export shared schemas for backward compatibility
export { PaginationQuerySchema, RoleIdParamSchema, type PaginationQueryType, type RoleIdParamType }
