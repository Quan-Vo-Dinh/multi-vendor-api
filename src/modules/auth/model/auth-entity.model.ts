import { z } from 'zod'

import { TypeOfVerificationCode } from 'src/shared/constants/auth.constant'

// Verification Code Entity Schema
export const VerificationCodeSchema = z.object({
  id: z.number().int().positive(),
  email: z.string().max(500),
  code: z.string().max(50),
  type: z.enum([
    TypeOfVerificationCode.REGISTER,
    TypeOfVerificationCode.FORGOT_PASSWORD,
    TypeOfVerificationCode.LOGIN,
    TypeOfVerificationCode.DISABLE_2FA,
  ]),
  expiresAt: z.date(),
  createdAt: z.date(),
})

export type VerificationCodeType = z.infer<typeof VerificationCodeSchema>

// Device Entity Schema
export const DeviceSchema = z.object({
  id: z.number(),
  userId: z.number(),
  userAgent: z.string(),
  ip: z.string(),
  lastActive: z.date(),
  createdAt: z.date(),
  isActive: z.boolean(),
})

export type DeviceType = z.infer<typeof DeviceSchema>

// Role Entity Schema
export const RoleSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().max(500),
  description: z.string(),
  isActive: z.boolean(),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type RoleType = z.infer<typeof RoleSchema>

// Refresh Token Entity Schema
export const RefreshTokenSchema = z.object({
  token: z.string(),
  userId: z.number(),
  deviceId: z.number(),
  expiresAt: z.date(),
  createdAt: z.date(),
})

export type RefreshTokenType = z.infer<typeof RefreshTokenSchema>
