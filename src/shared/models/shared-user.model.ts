import z from 'zod'

import { UserStatus } from 'src/shared/constants/auth.constant'

export const UserSchema = z.object({
  id: z.number().int().positive(),
  email: z.email(),
  name: z.string().min(1),
  password: z.string().min(6), // adjust min length as needed
  phoneNumber: z.string().min(10),
  avatar: z.string().nullable(),
  totpSecret: z.string().nullable(),
  status: z.enum([UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.BLOCKED]).default(UserStatus.ACTIVE),
  roleId: z.number().int().positive(),
  createdById: z.number().int().positive().nullable(),
  updatedById: z.number().int().positive().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type UserType = z.infer<typeof UserSchema>
