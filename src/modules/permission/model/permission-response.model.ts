import z from 'zod'

import { PermissionSchema } from './permission-entity.model'

// Paginated Response Metadata Schema
export const PaginationMetaSchema = z.object({
  totalItems: z.number().int().min(0),
  currentPage: z.number().int().min(1),
  totalPages: z.number().int().min(0),
  itemsPerPage: z.number().int().min(1),
})

// Get All Permissions Response Schema (with pagination)
export const GetAllPermissionsResSchema = z.object({
  data: z.array(PermissionSchema),
  meta: PaginationMetaSchema,
})

export type GetAllPermissionsResType = z.infer<typeof GetAllPermissionsResSchema>

// Get Permission Detail Response Schema
export const GetPermissionDetailResSchema = z.object({
  data: PermissionSchema,
})

export type GetPermissionDetailResType = z.infer<typeof GetPermissionDetailResSchema>

// Create Permission Response Schema
export const CreatePermissionResSchema = z.object({
  data: PermissionSchema,
})

export type CreatePermissionResType = z.infer<typeof CreatePermissionResSchema>

// Update Permission Response Schema
export const UpdatePermissionResSchema = z.object({
  data: PermissionSchema,
})

export type UpdatePermissionResType = z.infer<typeof UpdatePermissionResSchema>
