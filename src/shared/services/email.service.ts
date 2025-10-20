import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import React from 'react'
import { Resend } from 'resend'

import VerifyEmail from 'emails/otp-verify'
import type { EnvConfig } from 'src/shared/config'

@Injectable()
export class EmailService {
  private resend: Resend

  constructor(private readonly configService: ConfigService<EnvConfig>) {
    const resendApiKey = this.configService.get('RESEND_API_KEY', { infer: true })!
    this.resend = new Resend(resendApiKey)
  }

  sendOtp(payload: { email: string; code: string }) {
    return this.resend.emails.send({
      from: 'QR Ordering <no-reply@binrestaurant.io.vn>',
      to: [payload.email],
      subject: 'Your OTP Verification Code',
      react: React.createElement(VerifyEmail, { code: payload.code, title: 'Your OTP Verification Code' }),
    })
  }
}
