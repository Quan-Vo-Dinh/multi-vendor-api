import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { REQUEST_USER_KEY } from '../constants/auth.constant'
import { TokenPayload } from '../types/jwt.type'

export const ActiveUser = createParamDecorator((field: keyof TokenPayload | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  const user: TokenPayload | undefined = request[REQUEST_USER_KEY]
  if (!user) return null
  return field ? user[field] : user
})
