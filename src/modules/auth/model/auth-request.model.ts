import { z } from 'zod'

import { TypeOfVerificationCode } from 'src/shared/constants/auth.constant'
import { UserSchema } from 'src/shared/models/shared-user.model'

// Register Request Schema
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

// Login Request Schema
export const LoginBodySchema = UserSchema.pick({
  email: true,
  password: true,
})
  .extend({
    totpCode: z.string().length(6).optional(), // 2FA code
    code: z.string().length(6).optional(), // Email OTP code for login
  })
  .strict()

export type LoginBodyType = z.infer<typeof LoginBodySchema>

// Send OTP Request Schema
export const SendOtpBodySchema = z
  .object({
    email: z.email().max(500),
    type: z.enum([
      TypeOfVerificationCode.REGISTER,
      TypeOfVerificationCode.FORGOT_PASSWORD,
      TypeOfVerificationCode.LOGIN,
      TypeOfVerificationCode.DISABLE_2FA,
    ]),
  })
  .strict()

export type SendOtpBodyType = z.infer<typeof SendOtpBodySchema>

// Refresh Token Request Schema
export const RefreshTokenBodySchema = z
  .object({
    refreshToken: z.string(),
  })
  .strict()

export type RefreshTokenBodyType = z.infer<typeof RefreshTokenBodySchema>

// Logout Request Schema
export const LogoutBodySchema = RefreshTokenBodySchema

export type LogoutBodyType = z.infer<typeof LogoutBodySchema>

// Forgot Password Request Schema
export const ForgotPasswordBodySchema = z
  .object({
    email: z.email(),
    code: z.string().min(1).max(6),
    newPassword: z.string().min(6),
    confirmNewPassword: z.string().min(6),
  })
  .strict()
  .superRefine(({ newPassword, confirmNewPassword }, ctx) => {
    if (newPassword !== confirmNewPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
        path: ['confirmNewPassword'],
      })
    }
  })
export type ForgotPasswordBodyType = z.infer<typeof ForgotPasswordBodySchema>

export const DisableTwoFactorBodySchema = z
  .object({
    totpCode: z.string().length(6).optional(),
    code: z.string().length(6).optional(), // Email OTP code for disabling 2FA
  })
  .superRefine(({ totpCode, code }, ctx) => {
    // Nếu cả hai đều không có, thêm lỗi vào cả hai trường
    // Nếu một trong hai có, không thêm lỗi
    // Nếu cả hai đều có, thêm lỗi vào cả hai trường
    if (!totpCode && !code) {
      ctx.addIssue({
        code: 'custom',
        message: 'Either totpCode or code must be provided',
        path: ['totpCode'],
      })
      ctx.addIssue({
        code: 'custom',
        message: 'Either totpCode or code must be provided',
        path: ['code'],
      })
    } else if (totpCode && code) {
      ctx.addIssue({
        code: 'custom',
        message: 'Only one of totpCode or code should be provided',
        path: ['totpCode'],
      })
      ctx.addIssue({
        code: 'custom',
        message: 'Only one of totpCode or code should be provided',
        path: ['code'],
      })
    }
  })
  .strict()

export type DisableTwoFactorBodyType = z.infer<typeof DisableTwoFactorBodySchema>
