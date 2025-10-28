import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { HashingService } from 'src/shared/services/hashing.service'

import { InvalidPasswordException, UserNotFoundException } from './model/profile-error.model'
import type { ChangePasswordBodyType, UpdateProfileBodyType } from './model/profile-request.model'
import type { GetProfileResType, UpdateProfileResType } from './model/profile-response.model'
import { ProfileRepository } from './repo/profile.repo'

@Injectable()
export class ProfileService {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly hashingService: HashingService,
  ) {}

  async getProfile(userId: number): Promise<GetProfileResType> {
    const user = await this.profileRepository.findByIdWithRoleAndPermissions(userId)

    if (!user) {
      throw UserNotFoundException
    }

    return {
      data: user,
    }
  }

  async updateProfile(userId: number, body: UpdateProfileBodyType): Promise<UpdateProfileResType> {
    const user = await this.profileRepository.findById(userId)

    if (!user) {
      throw UserNotFoundException
    }

    // Explicit mapping - KHÔNG dùng spreading
    const dataToUpdate: Prisma.UserUpdateInput = {
      name: body.name,
      phoneNumber: body.phoneNumber,
      avatar: body.avatar,
      updatedBy: {
        connect: { id: userId },
      },
    }

    const updatedUser = await this.profileRepository.update(userId, dataToUpdate)

    return {
      data: updatedUser,
    }
  }

  async changePassword(userId: number, body: ChangePasswordBodyType): Promise<{ message: string }> {
    // 1. Get user with password
    const user = await this.profileRepository.findByIdWithPassword(userId)

    if (!user) {
      throw UserNotFoundException
    }

    // 2. Verify old password
    const isPasswordValid = await this.hashingService.compare(body.oldPassword, user.password)

    if (!isPasswordValid) {
      throw InvalidPasswordException
    }

    // 3. Hash new password
    const hashedPassword = await this.hashingService.hash(body.newPassword)

    // 4. Update password
    const dataToUpdate: Prisma.UserUpdateInput = {
      password: hashedPassword,
      updatedBy: {
        connect: { id: userId },
      },
    }

    await this.profileRepository.update(userId, dataToUpdate)

    return {
      message: 'Password changed successfully',
    }
  }
}
