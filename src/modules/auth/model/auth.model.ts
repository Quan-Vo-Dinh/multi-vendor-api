import { z } from 'zod'

import { TypeOfVerificationCode } from 'src/shared/constants/auth.constant'
import { UserSchema } from 'src/shared/models/shared-user.model'

export const RegisterBodySchema = UserSchema.pick({
  name: true,
  email: true,
  password: true,
  phoneNumber: true,
})
  .extend({
    confirmPassword: z.string().min(6),
    code: z.string().min(1).max(6),
  })
  .strict()
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      })
    }
  })

export type RegisterBodyType = z.infer<typeof RegisterBodySchema>

export const RegisterResSchema = UserSchema.omit({
  password: true,
  otpSecret: true,
})

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

export const SendOtpBodySchema = VerificationCodeSchema.pick({
  email: true,
  type: true,
}).strict()

export type SendOtpBodyType = z.infer<typeof SendOtpBodySchema>

export const LoginBodySchema = UserSchema.pick({
  email: true,
  password: true,
}).strict()

export type LoginBodyType = z.infer<typeof LoginBodySchema>

export const LoginResSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
})

export type LoginResType = z.infer<typeof LoginResSchema>

export const RefreshTokenBodySchema = z
  .object({
    refreshToken: z.string(),
  })
  .strict()

export type RefreshTokenBodyType = z.infer<typeof RefreshTokenBodySchema>

export const RefreshTokenResSchema = LoginResSchema

export type RefreshTokenResType = LoginResType

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
