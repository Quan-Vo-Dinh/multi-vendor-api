import { Body, Controller, Post } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'

import { LoginBodyDto, RegisterBodyDto, RegisterResDto, SendOtpBodyDto } from 'src/modules/auth/dto/auth.dto'
import { IP } from 'src/shared/decorators/ip.decorator'
import { UserAgent } from 'src/shared/decorators/user-agent.decorator'

import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ZodSerializerDto(RegisterResDto)
  async register(@Body() body: RegisterBodyDto) {
    return this.authService.register(body)
  }
  @Post('otp')
  async sendOtp(@Body() body: SendOtpBodyDto) {
    return this.authService.sendOtp(body)
  }

  @Post('login')
  async login(@Body() body: LoginBodyDto, @UserAgent() userAgent: string, @IP() ip: string) {
    return this.authService.login({
      ...body,
      userAgent,
      ip,
    })
  }
  //
  // @Post('refresh-token')
  // @HttpCode(HttpStatus.OK)
  // async refreshToken(@Body() body: any) {
  //   return this.authService.refreshToken(body.refreshToken)
  // }
  //
  // @Post('logout')
  // @HttpCode(HttpStatus.OK)
  // async logout(@Body() body: any) {
  //   return this.authService.logout(body.refreshToken)
  // }
}
