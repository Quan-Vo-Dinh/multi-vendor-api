import { Injectable } from '@nestjs/common'
import type { Prisma } from '@prisma/client'

import type { BrandWithTranslationsType } from 'src/modules/brand/model/brand-entity.model'
import type { PaginationQueryType } from 'src/shared/models/request.model'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class BrandRepository {
  constructor(private readonly prismaService: PrismaService) {}

  // Find all brands with pagination and translations
  async findAll(query: PaginationQueryType): Promise<{ brands: BrandWithTranslationsType[]; total: number }> {
    const { page, limit } = query
    const skip = (page - 1) * limit

    const [brands, total] = await Promise.all([
      this.prismaService.brand.findMany({
        where: {
          deletedAt: null,
        },
        select: {
          id: true,
          name: true,
          logo: true,
          createdById: true,
          updatedById: true,
          createdAt: true,
          updatedAt: true,
          brandTranslations: {
            where: {
              deletedAt: null,
            },
            select: {
              id: true,
              brandId: true,
              languageId: true,
              name: true,
              description: true,
              createdById: true,
              updatedById: true,
              createdAt: true,
              updatedAt: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prismaService.brand.count({
        where: {
          deletedAt: null,
        },
      }),
    ])

    return { brands: brands as BrandWithTranslationsType[], total }
  }

  // Find brand by ID with translations
  async findByIdWithTranslations(id: number): Promise<BrandWithTranslationsType | null> {
    const brand = await this.prismaService.brand.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        logo: true,
        createdById: true,
        updatedById: true,
        createdAt: true,
        updatedAt: true,
        brandTranslations: {
          where: {
            deletedAt: null,
          },
          select: {
            id: true,
            brandId: true,
            languageId: true,
            name: true,
            description: true,
            createdById: true,
            updatedById: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    return brand as BrandWithTranslationsType | null
  }

  // Find brand by name (for conflict check)
  async findByName(name: string): Promise<{ id: number; name: string } | null> {
    return await this.prismaService.brand.findFirst({
      where: {
        name,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
      },
    })
  }

  // Create brand
  async create(data: Prisma.BrandCreateInput): Promise<BrandWithTranslationsType> {
    const brand = await this.prismaService.brand.create({
      data,
      select: {
        id: true,
        name: true,
        logo: true,
        createdById: true,
        updatedById: true,
        createdAt: true,
        updatedAt: true,
        brandTranslations: {
          where: {
            deletedAt: null,
          },
          select: {
            id: true,
            brandId: true,
            languageId: true,
            name: true,
            description: true,
            createdById: true,
            updatedById: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    })

    return brand as BrandWithTranslationsType
  }

  // Update brand
  async update(id: number, data: Prisma.BrandUpdateInput): Promise<BrandWithTranslationsType> {
    const brand = await this.prismaService.brand.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        logo: true,
        createdById: true,
        updatedById: true,
        createdAt: true,
        updatedAt: true,
        brandTranslations: {
          where: {
            deletedAt: null,
          },
          select: {
            id: true,
            brandId: true,
            languageId: true,
            name: true,
            description: true,
            createdById: true,
            updatedById: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    return brand as BrandWithTranslationsType
  }

  // Soft delete brand
  async softDelete(id: number, deletedById: number): Promise<void> {
    await this.prismaService.brand.update({
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
