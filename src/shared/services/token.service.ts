import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { v4 as uuidv4 } from 'uuid'

import type { EnvConfig } from 'src/shared/config'
import {
  AccessTokenPayload,
  AccessTokenPayloadCreate,
  RefreshTokenPayload,
  RefreshTokenPayloadCreate,
} from 'src/shared/types/jwt.type'

@Injectable()
export class TokenService {
  private readonly accessTokenSecret: string
  private readonly refreshTokenSecret: string
  private readonly accessTokenExpiration: string
  private readonly refreshTokenExpiration: string

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvConfig>,
  ) {
    this.accessTokenSecret = this.configService.get('ACCESS_TOKEN_SECRET', { infer: true })!
    this.refreshTokenSecret = this.configService.get('REFRESH_TOKEN_SECRET', { infer: true })!
    this.accessTokenExpiration = this.configService.get('ACCESS_TOKEN_EXPIRATION', { infer: true })!
    this.refreshTokenExpiration = this.configService.get('REFRESH_TOKEN_EXPIRATION', { infer: true })!
  }

  signAccessToken(payload: AccessTokenPayloadCreate): string {
    return this.jwtService.sign(
      { ...payload, uuid: uuidv4() },
      {
        secret: this.accessTokenSecret,
        expiresIn: this.accessTokenExpiration,
        algorithm: 'HS256',
      },
    )
  }

  signRefreshToken(payload: RefreshTokenPayloadCreate): string {
    return this.jwtService.sign(
      { ...payload, uuid: uuidv4() },
      {
        secret: this.refreshTokenSecret,
        expiresIn: this.refreshTokenExpiration,
        algorithm: 'HS256',
      },
    )
  }

  verifyAccessToken(token: string): Promise<AccessTokenPayload> {
    return this.jwtService.verifyAsync(token, {
      secret: this.accessTokenSecret,
    })
  }

  verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
    return this.jwtService.verifyAsync(token, {
      secret: this.refreshTokenSecret,
    })
  }
}
