import { Injectable } from '@nestjs/common'
import type { Prisma } from '@prisma/client'

import type { BrandTranslationEntityType } from 'src/modules/brand/model/brand-entity.model'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class BrandTranslationRepository {
  constructor(private readonly prismaService: PrismaService) {}

  // Find translation by ID
  async findById(id: number): Promise<BrandTranslationEntityType | null> {
    const translation = await this.prismaService.brandTranslation.findFirst({
      where: {
        id,
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
    })

    return translation as BrandTranslationEntityType | null
  }

  // Find translation by brandId and languageId (for conflict check)
  async findByBrandAndLanguage(
    brandId: number,
    languageId: string,
  ): Promise<{ id: number; brandId: number; languageId: string } | null> {
    return await this.prismaService.brandTranslation.findFirst({
      where: {
        brandId,
        languageId,
        deletedAt: null,
      },
      select: {
        id: true,
        brandId: true,
        languageId: true,
      },
    })
  }

  // Check if language exists
  async languageExists(languageId: string): Promise<boolean> {
    const language = await this.prismaService.language.findFirst({
      where: {
        id: languageId,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    })
    return !!language
  }

  // Create translation
  async create(data: Prisma.BrandTranslationCreateInput): Promise<BrandTranslationEntityType> {
    const translation = await this.prismaService.brandTranslation.create({
      data,
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
    })

    return translation as BrandTranslationEntityType
  }

  // Update translation
  async update(id: number, data: Prisma.BrandTranslationUpdateInput): Promise<BrandTranslationEntityType> {
    const translation = await this.prismaService.brandTranslation.update({
      where: { id },
      data,
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
    })

    return translation as BrandTranslationEntityType
  }

  // Soft delete translation
  async softDelete(id: number, deletedById: number): Promise<void> {
    await this.prismaService.brandTranslation.update({
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
