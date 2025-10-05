import { Injectable } from '@nestjs/common'
import { Resend } from 'resend'

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
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; background: #fff; border: 1px solid #eee; border-radius: 8px; padding: 24px;">
          <h2 style="text-align:center; color:#333;">OTP Verification</h2>
          <p style="text-align:center; color:#555;">Use the code below to verify your account:</p>
          <div style="text-align:center; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #222;">${payload.code}</span>
          </div>
          <p style="text-align:center; color:#888; font-size:13px;">This code will expire in 5 minutes.</p>
          <p style="text-align:center; color:#aaa; font-size:12px; margin-top:16px;">If you did not request this code, please ignore this email.</p>
        </div>
      `,
    })
  }
}
