import z from 'zod'

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

// Role ID Param Schema
export const RoleIdParamSchema = z.object({
  roleId: z.string().regex(/^\d+$/, 'Role ID must be a number').transform(Number),
})

export type RoleIdParamType = z.infer<typeof RoleIdParamSchema>

// Pagination Query Schema (reuse from Permission)
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
