import { z } from 'zod'

import { UserSchema } from 'src/shared/models/shared-user.model'

// Register Response Schema
export const RegisterResSchema = UserSchema.omit({
  password: true,
  otpSecret: true,
})

export type RegisterResType = z.infer<typeof RegisterResSchema>

// Login Response Schema
export const LoginResSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
})

export type LoginResType = z.infer<typeof LoginResSchema>

// Refresh Token Response Schema
export const RefreshTokenResSchema = LoginResSchema

export type RefreshTokenResType = LoginResType
