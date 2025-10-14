export const REQUEST_USER_KEY = 'user'

export const AuthType = {
  Bearer: 'Bearer',
  None: 'None',
  ApiKey: 'ApiKey',
} as const

export type AuthType = (typeof AuthType)[keyof typeof AuthType]

export const ConditionGuardType = {
  AND: 'AND',
  OR: 'OR',
  NOT: 'NOT',
} as const

export type ConditionGuardType = (typeof ConditionGuardType)[keyof typeof ConditionGuardType]

export const UserStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  BLOCKED: 'BLOCKED',
} as const

export const TypeOfVerificationCode = {
  REGISTER: 'REGISTER',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
  LOGIN: 'LOGIN',
  DISABLE_2FA: 'DISABLE_2FA',
  LOGIN_2FA: 'LOGIN_2FA',
} as const

export type TypeofVerificationCode = (typeof TypeOfVerificationCode)[keyof typeof TypeOfVerificationCode]
