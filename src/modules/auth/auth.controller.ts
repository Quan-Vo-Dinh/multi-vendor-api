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
  TwoFactorActivateBodyDto,
  TwoFactorActivateResDto,
  TwoFactorDisableBodyDto,
  TwoFactorDisableResDto,
  TwoFactorSetupResDto,
  TwoFactorVerifyBodyDto,
} from 'src/modules/auth/dto/auth.dto'
import { LoginUnionResType } from 'src/modules/auth/model/auth.model'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { IsPublic } from 'src/shared/decorators/auth.decorator'
import { SkipAuthorization } from 'src/shared/decorators/skip-authorization.decorator'
import { UserAgent } from 'src/shared/decorators/user-agent.decorator'
import { EmptyBodyDto } from 'src/shared/dtos/request.dto'
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
  login(@Body() body: LoginBodyDto, @UserAgent() userAgent: string, @Ip() ip: string): Promise<LoginUnionResType> {
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
  @SkipAuthorization()
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

  @Post('2fa/setup')
  @SkipAuthorization()
  @ZodSerializerDto(TwoFactorSetupResDto)
  setupTwoFactorAuth(@Body() _: EmptyBodyDto, @ActiveUser('userId') userId: number) {
    return this.authService.setupTwoFactorAuth(userId)
  }

  @Post('2fa/activate')
  @SkipAuthorization()
  @ZodSerializerDto(TwoFactorActivateResDto)
  activateTwoFactorAuth(@Body() body: TwoFactorActivateBodyDto, @ActiveUser('userId') userId: number) {
    return this.authService.activateTwoFactorAuth(userId, body)
  }

  @Post('2fa/verify')
  @IsPublic()
  @ZodSerializerDto(LoginResDto)
  verifyTwoFactorAuth(@Body() body: TwoFactorVerifyBodyDto, @UserAgent() userAgent: string, @Ip() ip: string) {
    return this.authService.verifyTwoFactorAuth(body, { userAgent, ip })
  }

  @Post('2fa/disable')
  @SkipAuthorization()
  @ZodSerializerDto(TwoFactorDisableResDto)
  disableTwoFactorAuth(@Body() body: TwoFactorDisableBodyDto, @ActiveUser('userId') userId: number) {
    return this.authService.disableTwoFactorAuth(userId, body)
  }
}
