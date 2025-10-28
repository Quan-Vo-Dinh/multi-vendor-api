import z from 'zod'

import {
  PaginationMetaSchema,
  createDataResponseSchema,
  createPaginatedResponseSchema,
} from 'src/shared/models/response.model'

import { RoleSchema, RoleWithPermissionsSchema } from './role-entity.model'

// Get All Roles Response Schema (with pagination)
export const GetAllRolesResSchema = createPaginatedResponseSchema(RoleSchema)

export type GetAllRolesResType = z.infer<typeof GetAllRolesResSchema>

// Get Role Detail Response Schema (includes permissions)
export const GetRoleDetailResSchema = createDataResponseSchema(RoleWithPermissionsSchema)

export type GetRoleDetailResType = z.infer<typeof GetRoleDetailResSchema>

// Create Role Response Schema (includes permissions)
export const CreateRoleResSchema = createDataResponseSchema(RoleWithPermissionsSchema)

export type CreateRoleResType = z.infer<typeof CreateRoleResSchema>

// Update Role Response Schema (includes permissions)
export const UpdateRoleResSchema = createDataResponseSchema(RoleWithPermissionsSchema)

export type UpdateRoleResType = z.infer<typeof UpdateRoleResSchema>

// Re-export for backward compatibility
export { PaginationMetaSchema }
