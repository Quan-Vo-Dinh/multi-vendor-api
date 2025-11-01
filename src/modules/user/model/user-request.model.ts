import z from 'zod'

import { UserStatus } from 'src/shared/constants/auth.constant'
import { createIdParamSchema } from 'src/shared/models/request.model'

// Create User Request Schema
export const CreateUserBodySchema = z.object({
  email: z.email('Invalid email format').max(500, 'Email must be at most 500 characters'),
  name: z.string().min(1, 'Name is required').max(500, 'Name must be at most 500 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(500, 'Password must be at most 500 characters'),
  phoneNumber: z
    .string()
    .min(10, 'Phone number must be at least 10 characters')
    .max(50, 'Phone number must be at most 50 characters'),
  avatar: z.string().max(1000, 'Avatar URL must be at most 1000 characters').optional(),
  status: z.enum([UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.BLOCKED]).default(UserStatus.INACTIVE),
  roleId: z.number().int().positive('Role ID must be a positive number'),
})

export type CreateUserBodyType = z.infer<typeof CreateUserBodySchema>

// Update User Request Schema
export const UpdateUserBodySchema = z.object({
  email: z.email('Invalid email format').max(500, 'Email must be at most 500 characters').optional(),
  name: z.string().min(1, 'Name is required').max(500, 'Name must be at most 500 characters').optional(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(500, 'Password must be at most 500 characters')
    .optional(),
  phoneNumber: z
    .string()
    .min(10, 'Phone number must be at least 10 characters')
    .max(50, 'Phone number must be at most 50 characters')
    .optional(),
  avatar: z.string().max(1000, 'Avatar URL must be at most 1000 characters').optional(),
  status: z.enum([UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.BLOCKED]).optional(),
  roleId: z.number().int().positive('Role ID must be a positive number').optional(),
})

export type UpdateUserBodyType = z.infer<typeof UpdateUserBodySchema>

// User ID Param Schema
export const UserIdParamSchema = createIdParamSchema('userId', 'User')

export type UserIdParamType = z.infer<typeof UserIdParamSchema>

// Re-export PaginationQuerySchema for convenience
export { PaginationQuerySchema, type PaginationQueryType } from 'src/shared/models/request.model'
