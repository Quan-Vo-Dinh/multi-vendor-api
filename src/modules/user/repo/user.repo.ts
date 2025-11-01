import { Injectable } from '@nestjs/common'
import type { Prisma } from '@prisma/client'

import type { UserWithRoleType } from 'src/modules/user/model/user-entity.model'
import type { PaginationQueryType } from 'src/shared/models/request.model'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  // Find all users with pagination and role
  async findAll(query: PaginationQueryType): Promise<{ users: UserWithRoleType[]; total: number }> {
    const { page, limit } = query
    const skip = (page - 1) * limit

    const [users, total] = await Promise.all([
      this.prismaService.user.findMany({
        where: {
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
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prismaService.user.count({
        where: {
          deletedAt: null,
        },
      }),
    ])

    return { users: users as UserWithRoleType[], total }
  }

  // Find user by ID with role
  async findByIdWithRole(id: number): Promise<UserWithRoleType | null> {
    const user = await this.prismaService.user.findFirst({
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
          },
        },
      },
    })

    return user as UserWithRoleType | null
  }

  // Find user by email (for conflict check)
  async findByEmail(email: string): Promise<{ id: number; email: string } | null> {
    return await this.prismaService.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
      },
    })
  }

  // Check if role exists
  async roleExists(roleId: number): Promise<boolean> {
    const role = await this.prismaService.role.findFirst({
      where: {
        id: roleId,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    })
    return !!role
  }

  // Get role by ID (for Admin check)
  async getRoleById(roleId: number): Promise<{ id: number; name: string } | null> {
    return await this.prismaService.role.findFirst({
      where: {
        id: roleId,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
      },
    })
  }

  // Create user
  async create(data: Prisma.UserCreateInput): Promise<UserWithRoleType> {
    const user = await this.prismaService.user.create({
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
        role: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    })

    return user as UserWithRoleType
  }

  // Update user
  async update(id: number, data: Prisma.UserUpdateInput): Promise<UserWithRoleType> {
    const user = await this.prismaService.user.update({
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
        role: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    })

    return user as UserWithRoleType
  }

  // Soft delete user
  async softDelete(id: number, deletedById: number): Promise<void> {
    await this.prismaService.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy: {
          connect: { id: deletedById },
        },
      },
    })
  }
}
