import { Body, Controller, Get, Patch } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'

import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { MessageResDto } from 'src/shared/dtos/response.dto'
import type { AccessTokenPayload } from 'src/shared/types/jwt.type'

import { ChangePasswordBodyDto, GetProfileResDto, UpdateProfileBodyDto, UpdateProfileResDto } from './dto/profile.dto'
import { ProfileService } from './profile.service'

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ZodSerializerDto(GetProfileResDto)
  getProfile(@ActiveUser() user: AccessTokenPayload) {
    return this.profileService.getProfile(user.userId)
  }

  @Patch()
  @ZodSerializerDto(UpdateProfileResDto)
  updateProfile(@ActiveUser() user: AccessTokenPayload, @Body() body: UpdateProfileBodyDto) {
    return this.profileService.updateProfile(user.userId, body)
  }

  @Patch('change-password')
  @ZodSerializerDto(MessageResDto)
  changePassword(@ActiveUser() user: AccessTokenPayload, @Body() body: ChangePasswordBodyDto) {
    return this.profileService.changePassword(user.userId, body)
  }
}
