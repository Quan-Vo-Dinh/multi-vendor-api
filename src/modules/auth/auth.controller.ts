import { Body, Controller, HttpCode, HttpStatus, Ip, Post } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'

import {
  ForgotPasswordBodyDto,
  LoginBodyDto,
  LoginResDto,
  LogoutBodyDto,
  RefreshTokenBodyDto,
  RegisterBodyDto,
  RegisterResDto,
  SendOtpBodyDto,
} from 'src/modules/auth/dto/auth.dto'
import { IsPublic } from 'src/shared/decorators/auth.decorator'
import { UserAgent } from 'src/shared/decorators/user-agent.decorator'
import { MessageResDto } from 'src/shared/dtos/response.dto'

import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @IsPublic()
  @ZodSerializerDto(RegisterResDto)
  register(@Body() body: RegisterBodyDto) {
    return this.authService.register(body)
  }
  @Post('otp')
  @IsPublic()
  @ZodSerializerDto(MessageResDto)
  sendOtp(@Body() body: SendOtpBodyDto) {
    return this.authService.sendOtp(body)
  }

  @Post('login')
  @IsPublic()
  @ZodSerializerDto(LoginResDto)
  login(@Body() body: LoginBodyDto, @UserAgent() userAgent: string, @Ip() ip: string) {
    return this.authService.login({
      ...body,
      userAgent,
      ip,
    })
  }

  @Post('refresh-token')
  @IsPublic()
  @HttpCode(HttpStatus.OK)
  refreshToken(@Body() body: RefreshTokenBodyDto, @UserAgent() userAgent: string, @Ip() ip: string) {
    return this.authService.refreshToken({
      refreshToken: body.refreshToken,
      userAgent,
      ip,
    })
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(MessageResDto)
  logout(@Body() body: LogoutBodyDto) {
    return this.authService.logout(body.refreshToken)
  }

  @Post('forgot-password')
  @IsPublic()
  @ZodSerializerDto(MessageResDto)
  forgotPassword(@Body() body: ForgotPasswordBodyDto) {
    return this.authService.forgotPassword(body)
  }
}
