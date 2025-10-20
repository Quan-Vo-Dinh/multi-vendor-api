import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as OTPAuth from 'otpauth'

import type { EnvConfig } from '../config'

@Injectable()
export class TwoFactorAuthService {
  private readonly appName: string

  constructor(private readonly configService: ConfigService<EnvConfig>) {
    this.appName = this.configService.get('APP_NAME', { infer: true })!
  }

  generateTOTPSecret(email: string) {
    // Generate secret once for setup
    const secretObj = new OTPAuth.Secret({ size: 20 })
    const totp = new OTPAuth.TOTP({
      issuer: this.appName,
      label: email,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: secretObj,
    })

    return {
      secret: secretObj.base32,
      uri: totp.toString(),
    }
  }

  verifyTOTP({ email, token, secretBase32 }: { email: string; token: string; secretBase32: string }): boolean {
    // Always use Secret.fromBase32() for verify
    const secretObj = OTPAuth.Secret.fromBase32(secretBase32)
    const totp = new OTPAuth.TOTP({
      issuer: this.appName,
      label: email,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: secretObj,
    })

    const delta = totp.validate({ token, window: 1 })
    return delta !== null
  }
}
