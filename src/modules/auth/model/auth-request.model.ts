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
}).strict()

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
