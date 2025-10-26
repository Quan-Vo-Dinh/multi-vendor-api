import z from 'zod'

import { RoleSchema, RoleWithPermissionsSchema } from './role-entity.model'

// Paginated Response Metadata Schema
export const PaginationMetaSchema = z.object({
  totalItems: z.number().int().min(0),
  currentPage: z.number().int().min(1),
  totalPages: z.number().int().min(0),
  itemsPerPage: z.number().int().min(1),
})

// Get All Roles Response Schema (with pagination)
export const GetAllRolesResSchema = z.object({
  data: z.array(RoleSchema),
  meta: PaginationMetaSchema,
})

export type GetAllRolesResType = z.infer<typeof GetAllRolesResSchema>

// Get Role Detail Response Schema (includes permissions)
export const GetRoleDetailResSchema = z.object({
  data: RoleWithPermissionsSchema,
})

export type GetRoleDetailResType = z.infer<typeof GetRoleDetailResSchema>

// Create Role Response Schema (includes permissions)
export const CreateRoleResSchema = z.object({
  data: RoleWithPermissionsSchema,
})

export type CreateRoleResType = z.infer<typeof CreateRoleResSchema>

// Update Role Response Schema (includes permissions)
export const UpdateRoleResSchema = z.object({
  data: RoleWithPermissionsSchema,
})

export type UpdateRoleResType = z.infer<typeof UpdateRoleResSchema>
