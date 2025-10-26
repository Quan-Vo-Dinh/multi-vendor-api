import { Injectable } from '@nestjs/common'
import type { Prisma } from '@prisma/client'

import type { RoleEntityType, RoleWithPermissionsType } from 'src/modules/role/model/role-entity.model'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class RoleRepository {
  constructor(private readonly prismaService: PrismaService) {}

  // Find all roles with pagination (not deleted)
  async findAll(skip: number, take: number): Promise<{ data: RoleEntityType[]; total: number }> {
    const [data, total] = await Promise.all([
      this.prismaService.role.findMany({
        where: {
          deletedAt: null,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take,
      }),
      this.prismaService.role.count({
        where: {
          deletedAt: null,
        },
      }),
    ])

    return { data, total }
  }

  // Find role by ID (without permissions)
  findById(id: number): Promise<RoleEntityType | null> {
    return this.prismaService.role.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    })
  }

  // Find role by ID with permissions
  findByIdWithPermissions(id: number): Promise<RoleWithPermissionsType | null> {
    return this.prismaService.role.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        permissions: {
          where: {
            deletedAt: null,
          },
        },
      },
    })
  }

  // Check if role with same name exists
  existsByName(name: string, excludeId?: number): Promise<boolean> {
    return this.prismaService.role
      .findFirst({
        where: {
          name,
          deletedAt: null,

          // Conditional Spread
          ...(excludeId && { id: { not: excludeId } }),
        },
      })
      .then((role) => !!role)
  }

  // Create new role
  create(data: Prisma.RoleCreateInput): Promise<RoleWithPermissionsType> {
    return this.prismaService.role.create({
      data,
      include: {
        permissions: {
          where: {
            deletedAt: null,
          },
        },
      },
    })
  }

  // Update role
  update(id: number, data: Prisma.RoleUpdateInput): Promise<RoleWithPermissionsType> {
    return this.prismaService.role.update({
      where: { id },
      data,
      include: {
        permissions: {
          where: {
            deletedAt: null,
          },
        },
      },
    })
  }

  // Soft delete role
  softDelete(id: number, deletedById: number): Promise<RoleEntityType> {
    return this.prismaService.role.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedById,
      },
    })
  }

  // Hard delete role (not used but included for completeness)
  delete(id: number): Promise<RoleEntityType> {
    return this.prismaService.role.delete({
      where: { id },
    })
  }

  // Validate permission IDs exist
  async validatePermissionIds(permissionIds: number[]): Promise<boolean> {
    if (permissionIds.length === 0) return true

    const count = await this.prismaService.permission.count({
      where: {
        id: { in: permissionIds },
        deletedAt: null,
      },
    })

    return count === permissionIds.length
  }
}
