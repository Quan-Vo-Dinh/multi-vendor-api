import z from 'zod'

import { UserSchema } from 'src/shared/models/shared-user.model'

// User Entity (for list/detail responses) - Omit sensitive fields
export const UserEntitySchema = UserSchema.omit({
  password: true,
  totpSecret: true,
  deletedAt: true,
})

export type UserEntityType = z.infer<typeof UserEntitySchema>

// User with Role (for detail view and list view)
export const UserWithRoleSchema = UserEntitySchema.extend({
  role: z.object({
    id: z.number().int(),
    name: z.string(),
    description: z.string(),
  }),
})

export type UserWithRoleType = z.infer<typeof UserWithRoleSchema>
