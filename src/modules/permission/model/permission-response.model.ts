import z from 'zod'

import {
  PaginationMetaSchema,
  createDataResponseSchema,
  createPaginatedResponseSchema,
} from 'src/shared/models/response.model'

import { PermissionSchema } from './permission-entity.model'

// Get All Permissions Response Schema (with pagination)
export const GetAllPermissionsResSchema = createPaginatedResponseSchema(PermissionSchema)

export type GetAllPermissionsResType = z.infer<typeof GetAllPermissionsResSchema>

// Get Permission Detail Response Schema
export const GetPermissionDetailResSchema = createDataResponseSchema(PermissionSchema)

export type GetPermissionDetailResType = z.infer<typeof GetPermissionDetailResSchema>

// Create Permission Response Schema
export const CreatePermissionResSchema = createDataResponseSchema(PermissionSchema)

export type CreatePermissionResType = z.infer<typeof CreatePermissionResSchema>

// Update Permission Response Schema
export const UpdatePermissionResSchema = createDataResponseSchema(PermissionSchema)

export type UpdatePermissionResType = z.infer<typeof UpdatePermissionResSchema>

// Re-export for backward compatibility
export { PaginationMetaSchema }
