import z from 'zod'

import { PermissionSchema } from 'src/modules/permission/model/permission-entity.model'
import { RoleSchema } from 'src/modules/role/model/role-entity.model'
import { UserSchema } from 'src/shared/models/shared-user.model'

// User Profile Schema - Omit sensitive fields (password, totpSecret, deletedAt)
export const UserProfileSchema = UserSchema.omit({
  password: true,
  totpSecret: true,
  deletedAt: true,
})

export type UserProfileType = z.infer<typeof UserProfileSchema>

// User with Role and Permissions (for GET /profile response)
export const UserProfileWithRoleAndPermissionsSchema = UserProfileSchema.extend({
  role: RoleSchema.extend({
    permissions: z.array(PermissionSchema),
  }),
})

export type UserProfileWithRoleAndPermissionsType = z.infer<typeof UserProfileWithRoleAndPermissionsSchema>
