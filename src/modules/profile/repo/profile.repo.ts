import { Injectable } from '@nestjs/common'
import type { Prisma } from '@prisma/client'

import type {
  UserProfileType,
  UserProfileWithRoleAndPermissionsType,
} from 'src/modules/profile/model/profile-entity.model'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class ProfileRepository {
  constructor(private readonly prismaService: PrismaService) {}

  // Find user by ID with role and permissions
  async findByIdWithRoleAndPermissions(id: number): Promise<UserProfileWithRoleAndPermissionsType | null> {
    return this.prismaService.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phoneNumber: true,
        avatar: true,
        status: true,
        roleId: true,
        createdById: true,
        updatedById: true,
        createdAt: true,
        updatedAt: true,
        role: {
          select: {
            id: true,
            name: true,
            description: true,
            isActive: true,
            createdById: true,
            updatedById: true,
            deletedById: true,
            deletedAt: true,
            createdAt: true,
            updatedAt: true,
            permissions: {
              where: {
                deletedAt: null,
              },
              select: {
                id: true,
                name: true,
                description: true,
                path: true,
                method: true,
                module: true,
                createdById: true,
                updatedById: true,
                deletedById: true,
                deletedAt: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    })
  }

  // Find user by ID (without role and permissions)
  async findById(id: number): Promise<UserProfileType | null> {
    return this.prismaService.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phoneNumber: true,
        avatar: true,
        status: true,
        roleId: true,
        createdById: true,
        updatedById: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  }

  // Find user by ID with password (for change password)
  async findByIdWithPassword(id: number): Promise<{ id: number; password: string } | null> {
    return this.prismaService.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: {
        id: true,
        password: true,
      },
    })
  }

  // Update user
  async update(id: number, data: Prisma.UserUpdateInput): Promise<UserProfileType> {
    return this.prismaService.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        phoneNumber: true,
        avatar: true,
        status: true,
        roleId: true,
        createdById: true,
        updatedById: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  }
}
