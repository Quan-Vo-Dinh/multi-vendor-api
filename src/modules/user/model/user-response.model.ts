import z from 'zod'

import { createDataResponseSchema, createPaginatedResponseSchema } from 'src/shared/models/response.model'

import { UserWithRoleSchema } from './user-entity.model'

// Get All Users Response Schema (with pagination)
export const GetAllUsersResSchema = createPaginatedResponseSchema(UserWithRoleSchema)

export type GetAllUsersResType = z.infer<typeof GetAllUsersResSchema>

// Get User Detail Response Schema (includes role)
export const GetUserDetailResSchema = createDataResponseSchema(UserWithRoleSchema)

export type GetUserDetailResType = z.infer<typeof GetUserDetailResSchema>

// Create User Response Schema (includes role)
export const CreateUserResSchema = createDataResponseSchema(UserWithRoleSchema)

export type CreateUserResType = z.infer<typeof CreateUserResSchema>

// Update User Response Schema (includes role)
export const UpdateUserResSchema = createDataResponseSchema(UserWithRoleSchema)

export type UpdateUserResType = z.infer<typeof UpdateUserResSchema>
