import { SetMetadata } from '@nestjs/common'

import { AuthType, ConditionGuardType } from 'src/shared/constants/auth.constant'

// gắn metadata vào route để xác định loại auth và điều kiện để guard và interceptor truy xuất và sử dụng
// sử dụng bằng AUTH_TYPE_KEY

export type AuthMetadataPayload = { authTypes: AuthType[]; options: { conditions: ConditionGuardType } }

export const AUTH_TYPE_KEY = 'authTypes'
export const Auth = (authTypes: AuthType[], options?: { conditions: ConditionGuardType }) =>
  SetMetadata(AUTH_TYPE_KEY, { authTypes, options: options ?? { conditions: ConditionGuardType.AND } })
