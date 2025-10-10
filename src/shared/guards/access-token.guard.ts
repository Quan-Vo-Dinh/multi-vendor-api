import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { REQUEST_USER_KEY } from '../constants/auth.constant'
import { TokenService } from './../services/token.service'

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly TokenService: TokenService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const accessToken = request.headers['authorization']?.split(' ')[1]

    if (!accessToken) {
      throw new UnauthorizedException('No access token provided')
    }
    try {
      const decodedAccessToken = await this.TokenService.verifyAccessToken(accessToken)
      request[REQUEST_USER_KEY] = decodedAccessToken
      return true
    } catch {
      throw new UnauthorizedException('Invalid access token')
    }
  }
}
