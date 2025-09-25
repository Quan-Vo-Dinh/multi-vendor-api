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
