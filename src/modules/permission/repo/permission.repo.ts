import { Injectable } from '@nestjs/common'
import type { HTTPMethod, Prisma } from '@prisma/client'

import type { PermissionEntityType } from 'src/modules/permission/model/permission-entity.model'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class PermissionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  // Find all permissions with pagination (not deleted)
  async findAll(skip: number, take: number): Promise<{ data: PermissionEntityType[]; total: number }> {
    const [data, total] = await Promise.all([
      this.prismaService.permission.findMany({
        where: {
          deletedAt: null,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take,
      }),
      this.prismaService.permission.count({
        where: {
          deletedAt: null,
        },
      }),
    ])

    return { data, total }
  }

  // Find permission by ID
  findById(id: number): Promise<PermissionEntityType | null> {
    return this.prismaService.permission.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    })
  }

  // Check if permission with same path and method exists
  existsByPathAndMethod(path: string, method: HTTPMethod, excludeId?: number): Promise<boolean> {
    return this.prismaService.permission
      .findFirst({
        where: {
          path,
          method,
          deletedAt: null,

          // Conditional Spread
          ...(excludeId && { id: { not: excludeId } }),
        },
      })
      .then((permission) => !!permission)
  }

  // Create new permission
  create(data: Prisma.PermissionCreateInput): Promise<PermissionEntityType> {
    return this.prismaService.permission.create({
      data,
    })
  }

  // Update permission
  update(id: number, data: Prisma.PermissionUpdateInput): Promise<PermissionEntityType> {
    return this.prismaService.permission.update({
      where: { id },
      data,
    })
  }

  // Soft delete permission
  softDelete(id: number, deletedById: number): Promise<PermissionEntityType> {
    return this.prismaService.permission.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedById,
      },
    })
  }

  // Hard delete permission (not used but included for completeness)
  delete(id: number): Promise<PermissionEntityType> {
    return this.prismaService.permission.delete({
      where: { id },
    })
  }
}
