import z from 'zod'

import { PermissionSchema } from 'src/modules/permission/model/permission-entity.model'

// Role Entity Schema
export const RoleSchema = z.object({
  id: z.number().int(),
  name: z.string().max(500),
  description: z.string(),
  isActive: z.boolean(),
  createdById: z.number().int().nullable(),
  updatedById: z.number().int().nullable(),
  deletedById: z.number().int().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type RoleEntityType = z.infer<typeof RoleSchema>

// Role with Permissions (for detail view)
export const RoleWithPermissionsSchema = RoleSchema.extend({
  permissions: z.array(PermissionSchema),
})

export type RoleWithPermissionsType = z.infer<typeof RoleWithPermissionsSchema>
