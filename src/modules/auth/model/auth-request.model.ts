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
    email: z.email().max(500).optional(),
    type: z.enum([
      TypeOfVerificationCode.REGISTER,
      TypeOfVerificationCode.FORGOT_PASSWORD,
      TypeOfVerificationCode.LOGIN,
      TypeOfVerificationCode.DISABLE_2FA,
      TypeOfVerificationCode.LOGIN_2FA,
    ]),
    tempSessionId: z.string().optional(),
  })
  .strict()
  .superRefine(({ type, email, tempSessionId }, ctx) => {
    // For LOGIN_2FA, tempSessionId is required, email is optional
    if (type === 'LOGIN_2FA') {
      if (!tempSessionId) {
        ctx.addIssue({
          code: 'custom',
          message: 'tempSessionId is required for LOGIN_2FA type',
          path: ['tempSessionId'],
        })
      }
    } else {
      // For other types, email is required
      if (!email) {
        ctx.addIssue({
          code: 'custom',
          message: 'email is required for this type',
          path: ['email'],
        })
      }
    }
  })

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

// 2FA Activate Request Schema
export const TwoFactorActivateBodySchema = z
  .object({
    tempId: z.string({
      message: 'Error.InvalidType.TwoFactorActivate.TempId',
    }),
    token: z
      .string({
        message: 'Error.InvalidType.TwoFactorActivate.Token',
      })
      .length(6, {
        message: 'Error.Invalid.TwoFactorActivate.Token.MustBe6Digits',
      }),
  })
  .strict()

export type TwoFactorActivateBodyType = z.infer<typeof TwoFactorActivateBodySchema>

// 2FA Verify Request Schema
export const TwoFactorVerifyBodySchema = z
  .object({
    tempSessionId: z.string({
      message: 'Error.InvalidType.TwoFactorVerify.TempSessionId',
    }),
    token: z
      .string({
        message: 'Error.InvalidType.TwoFactorVerify.Token',
      })
      .length(6, {
        message: 'Error.Invalid.TwoFactorVerify.Token.MustBe6Digits',
      }),
    method: z
      .enum(['totp', 'email'], {
        message: 'Error.Invalid.TwoFactorVerify.Method',
      })
      .optional()
      .default('totp'),
  })
  .strict()

export type TwoFactorVerifyBodyType = z.infer<typeof TwoFactorVerifyBodySchema>

// 2FA Disable Request Schema
export const TwoFactorDisableBodySchema = z
  .object({
    token: z
      .string({
        message: 'Error.InvalidType.TwoFactorDisable.Token',
      })
      .length(6, {
        message: 'Error.Invalid.TwoFactorDisable.Token.MustBe6Digits',
      }),
  })
  .strict()

export type TwoFactorDisableBodyType = z.infer<typeof TwoFactorDisableBodySchema>
