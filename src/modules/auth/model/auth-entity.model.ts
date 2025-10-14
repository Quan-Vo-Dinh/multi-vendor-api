import { z } from 'zod'

import { TypeOfVerificationCode } from 'src/shared/constants/auth.constant'

// Verification Code Entity Schema
export const VerificationCodeSchema = z.object({
  id: z
    .number({
      message: 'Error.InvalidType.VerificationCode.Id',
    })
    .int({
      message: 'Error.Invalid.VerificationCode.Id.MustBeInteger',
    })
    .positive({
      message: 'Error.Invalid.VerificationCode.Id.MustBePositive',
    }),
  email: z
    .string({
      message: 'Error.InvalidType.VerificationCode.Email',
    })
    .max(500, {
      message: 'Error.Invalid.VerificationCode.Email.TooLong',
    }),
  code: z
    .string({
      message: 'Error.InvalidType.VerificationCode.Code',
    })
    .max(50, {
      message: 'Error.Invalid.VerificationCode.Code.TooLong',
    }),
  type: z.enum(
    [
      TypeOfVerificationCode.REGISTER,
      TypeOfVerificationCode.FORGOT_PASSWORD,
      TypeOfVerificationCode.LOGIN,
      TypeOfVerificationCode.DISABLE_2FA,
      TypeOfVerificationCode.LOGIN_2FA,
    ],
    {
      message: 'Error.Invalid.VerificationCode.Type',
    },
  ),
  expiresAt: z.date({
    message: 'Error.InvalidType.VerificationCode.ExpiresAt',
  }),
  createdAt: z.date({
    message: 'Error.InvalidType.VerificationCode.CreatedAt',
  }),
})

export type VerificationCodeType = z.infer<typeof VerificationCodeSchema>

// Device Entity Schema
export const DeviceSchema = z.object({
  id: z.number({
    message: 'Error.InvalidType.Device.Id',
  }),
  userId: z.number({
    message: 'Error.InvalidType.Device.UserId',
  }),
  userAgent: z.string({
    message: 'Error.InvalidType.Device.UserAgent',
  }),
  ip: z.string({
    message: 'Error.InvalidType.Device.Ip',
  }),
  lastActive: z.date({
    message: 'Error.InvalidType.Device.LastActive',
  }),
  createdAt: z.date({
    message: 'Error.InvalidType.Device.CreatedAt',
  }),
  isActive: z.boolean({
    message: 'Error.InvalidType.Device.IsActive',
  }),
})

export type DeviceType = z.infer<typeof DeviceSchema>

// Role Entity Schema
export const RoleSchema = z.object({
  id: z
    .number({
      message: 'Error.InvalidType.Role.Id',
    })
    .int({
      message: 'Error.Invalid.Role.Id.MustBeInteger',
    })
    .positive({
      message: 'Error.Invalid.Role.Id.MustBePositive',
    }),
  name: z
    .string({
      message: 'Error.InvalidType.Role.Name',
    })
    .max(500, {
      message: 'Error.Invalid.Role.Name.TooLong',
    }),
  description: z.string({
    message: 'Error.InvalidType.Role.Description',
  }),
  isActive: z.boolean({
    message: 'Error.InvalidType.Role.IsActive',
  }),
  createdById: z
    .number({
      message: 'Error.InvalidType.Role.CreatedById',
    })
    .nullable(),
  updatedById: z
    .number({
      message: 'Error.InvalidType.Role.UpdatedById',
    })
    .nullable(),
  deletedAt: z
    .date({
      message: 'Error.InvalidType.Role.DeletedAt',
    })
    .nullable(),
  createdAt: z.date({
    message: 'Error.InvalidType.Role.CreatedAt',
  }),
  updatedAt: z.date({
    message: 'Error.InvalidType.Role.UpdatedAt',
  }),
})

export type RoleType = z.infer<typeof RoleSchema>

// Refresh Token Entity Schema
export const RefreshTokenSchema = z.object({
  token: z.string({
    message: 'Error.InvalidType.RefreshToken.Token',
  }),
  userId: z.number({
    message: 'Error.InvalidType.RefreshToken.UserId',
  }),
  deviceId: z.number({
    message: 'Error.InvalidType.RefreshToken.DeviceId',
  }),
  expiresAt: z.date({
    message: 'Error.InvalidType.RefreshToken.ExpiresAt',
  }),
  createdAt: z.date({
    message: 'Error.InvalidType.RefreshToken.CreatedAt',
  }),
})

export type RefreshTokenType = z.infer<typeof RefreshTokenSchema>
