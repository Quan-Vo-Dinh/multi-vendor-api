import z from 'zod'

import { createDataResponseSchema } from 'src/shared/models/response.model'

import { UserProfileSchema, UserProfileWithRoleAndPermissionsSchema } from './profile-entity.model'

// GET /profile Response
export const GetProfileResSchema = createDataResponseSchema(UserProfileWithRoleAndPermissionsSchema)

export type GetProfileResType = z.infer<typeof GetProfileResSchema>

// PATCH /profile Response
export const UpdateProfileResSchema = createDataResponseSchema(UserProfileSchema)

export type UpdateProfileResType = z.infer<typeof UpdateProfileResSchema>
