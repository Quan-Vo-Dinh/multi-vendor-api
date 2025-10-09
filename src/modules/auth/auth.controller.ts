import { Body, Controller, HttpCode, HttpStatus, Ip, Post } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'

import {
  LoginBodyDto,
  LoginResDto,
  RefreshTokenBodyDto,
  RegisterBodyDto,
  RegisterResDto,
  SendOtpBodyDto,
} from 'src/modules/auth/dto/auth.dto'
import { UserAgent } from 'src/shared/decorators/user-agent.decorator'

import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ZodSerializerDto(RegisterResDto)
  register(@Body() body: RegisterBodyDto) {
    return this.authService.register(body)
  }
  @Post('otp')
  sendOtp(@Body() body: SendOtpBodyDto) {
    return this.authService.sendOtp(body)
  }

  @Post('login')
  @ZodSerializerDto(LoginResDto)
  login(@Body() body: LoginBodyDto, @UserAgent() userAgent: string, @Ip() ip: string) {
    return this.authService.login({
      ...body,
      userAgent,
      ip,
    })
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  refreshToken(@Body() body: RefreshTokenBodyDto, @UserAgent() userAgent: string, @Ip() ip: string) {
    return this.authService.refreshToken({
      refreshToken: body.refreshToken,
      userAgent,
      ip,
    })
  }
  //
  // @Post('logout')
  // @HttpCode(HttpStatus.OK)
  // async logout(@Body() body: any) {
  //   return this.authService.logout(body.refreshToken)
  // }
}
