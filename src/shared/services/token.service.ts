import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { envConfig } from '../config'
import { TokenPayload } from '../types/jwt.type'

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  signAccessToken(payload: { userId: string }): string {
    return this.jwtService.sign(payload, {
      secret: envConfig.ACCESS_TOKEN_SECRET,
      expiresIn: envConfig.ACCESS_TOKEN_EXPIRATION,
      algorithm: 'HS256',
    })
  }

  signRefreshToken(payload: { userId: string }): string {
    return this.jwtService.sign(payload, {
      secret: envConfig.REFRESH_TOKEN_SECRET,
      expiresIn: envConfig.REFRESH_TOKEN_EXPIRATION,
      algorithm: 'HS256',
    })
  }

  async verifyAccessToken(token: string): Promise<TokenPayload> {
    const rawPayload = await this.jwtService.verifyAsync(token, {
      secret: envConfig.ACCESS_TOKEN_SECRET,
    })

    // Parse để đảm bảo đúng kiểu dữ liệu
    return {
      userId: Number(rawPayload.userId),
      exp: Number(rawPayload.exp),
      iat: Number(rawPayload.iat),
    }
  }

  async verifyRefreshToken(token: string): Promise<TokenPayload> {
    const rawPayload = await this.jwtService.verifyAsync(token, {
      secret: envConfig.REFRESH_TOKEN_SECRET,
    })

    // Parse để đảm bảo đúng kiểu dữ liệu
    return {
      userId: Number(rawPayload.userId),
      exp: Number(rawPayload.exp),
      iat: Number(rawPayload.iat),
    }
  }
}
