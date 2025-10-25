import { Injectable } from '@nestjs/common'
import type { Prisma } from '@prisma/client'

import type { LanguageEntityType } from 'src/modules/language/model/language-entity.model'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class LanguageRepository {
  constructor(private readonly prismaService: PrismaService) {}

  // Find all languages (not deleted)
  findAll(): Promise<LanguageEntityType[]> {
    return this.prismaService.language.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  // Find language by ID
  findById(id: string): Promise<LanguageEntityType | null> {
    return this.prismaService.language.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    })
  }

  // Check if language ID already exists
  existsById(id: string): Promise<boolean> {
    return this.prismaService.language
      .findFirst({
        where: {
          id,
          deletedAt: null,
        },
      })
      .then((language) => !!language)
  }

  // Create new language
  create(data: Prisma.LanguageCreateInput): Promise<LanguageEntityType> {
    return this.prismaService.language.create({
      data,
    })
  }

  // Update language
  update(id: string, data: Prisma.LanguageUpdateInput): Promise<LanguageEntityType> {
    return this.prismaService.language.update({
      where: { id },
      data,
    })
  }

  // Soft delete language
  softDelete(id: string, deletedById: number): Promise<LanguageEntityType> {
    return this.prismaService.language.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedById,
      },
    })
  }

  // Hard delete language
  delete(id: string): Promise<LanguageEntityType> {
    return this.prismaService.language.delete({
      where: { id },
    })
  }
}
