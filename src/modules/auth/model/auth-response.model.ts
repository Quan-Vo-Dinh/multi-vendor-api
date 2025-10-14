import { z } from 'zod'

import { UserSchema } from 'src/shared/models/shared-user.model'

// Register Response Schema
export const RegisterResSchema = UserSchema.omit({
  password: true,
  totpSecret: true,
})

export type RegisterResType = z.infer<typeof RegisterResSchema>

// Login Response Schema - Normal login (no 2FA)
export const LoginTokensResSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
})

export type LoginTokensResType = z.infer<typeof LoginTokensResSchema>

// Login Response Schema - Keep original for DTO compatibility
export const LoginResSchema = LoginTokensResSchema

export type LoginResType = z.infer<typeof LoginResSchema>

// Login Response Union Type (for actual service return)
export type LoginUnionResType =
  | LoginTokensResType
  | {
      requires2FA: true
      tempSessionId: string
    }

// Refresh Token Response Schema
export const RefreshTokenResSchema = LoginTokensResSchema

export type RefreshTokenResType = LoginTokensResType

// 2FA Setup Response Schema
export const TwoFactorSetupResSchema = z.object({
  tempId: z.string(),
  secret: z.string(),
  uri: z.string(),
})

export type TwoFactorSetupResType = z.infer<typeof TwoFactorSetupResSchema>

// 2FA Activate Response Schema
export const TwoFactorActivateResSchema = z.object({
  success: z.boolean(),
})

export type TwoFactorActivateResType = z.infer<typeof TwoFactorActivateResSchema>

// 2FA Disable Response Schema
export const TwoFactorDisableResSchema = z.object({
  success: z.boolean(),
})

export type TwoFactorDisableResType = z.infer<typeof TwoFactorDisableResSchema>
