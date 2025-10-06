import { Injectable } from '@nestjs/common'
import React from 'react'
import { Resend } from 'resend'

import VerifyEmail from 'emails/otp-verify'
import { envConfig } from 'src/shared/config'

@Injectable()
export class EmailService {
  private resend: Resend
  constructor() {
    this.resend = new Resend(envConfig.RESEND_API_KEY)
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
