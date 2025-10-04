import { z } from 'zod'

import { TypeOfVerificationCode, UserStatus } from 'src/shared/constants/auth.constant'

export const UserSchema = z.object({
  id: z.number().int().positive(),
  email: z.email(),
  name: z.string().min(1),
  password: z.string().min(6), // adjust min length as needed
  phoneNumber: z.string().min(10),
  avatar: z.string().nullable(),
  otpSecret: z.string().nullable(),
  status: z.enum([UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.BLOCKED]).default(UserStatus.ACTIVE),
  roleId: z.number().int().positive(),
  createdById: z.number().int().positive().nullable(),
  updatedById: z.number().int().positive().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type UserType = z.infer<typeof UserSchema>

export const RegisterBodySchema = UserSchema.pick({
  name: true,
  email: true,
  password: true,
  phoneNumber: true,
})
  .extend({
    confirmPassword: z.string().min(6),
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
  totpSecret: true,
})

export const VerificationCode = z.object({
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

export type VerificationCodeType = z.infer<typeof VerificationCode>

export const SendOtpBodySchema = VerificationCode.pick({
  email: true,
  type: true,
}).strict()

export type SendOtpBodyType = z.infer<typeof SendOtpBodySchema>
