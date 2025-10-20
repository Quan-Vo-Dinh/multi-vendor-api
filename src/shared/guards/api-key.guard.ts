import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import type { EnvConfig } from '../config'

@Injectable()
export class APIKeyGuard implements CanActivate {
  private readonly secretApiKey: string

  constructor(private readonly configService: ConfigService<EnvConfig>) {
    this.secretApiKey = this.configService.get('SECRET_API_KEY', { infer: true })!
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const xAPIKey = request.headers['x-api-key']
    if (!xAPIKey) {
      throw new UnauthorizedException('API key is missing')
    }
    if (xAPIKey !== this.secretApiKey) {
      throw new UnauthorizedException('Invalid API key')
    }
    return true
  }
}
