import { Injectable } from '@nestjs/common'
import type { Prisma } from '@prisma/client'
import { I18nService } from 'nestjs-i18n'

import type { I18nTranslations } from 'src/generated/types/i18n.generated'
import {
  BrandNameConflictException,
  BrandNotFoundException,
  BrandTranslationConflictException,
  BrandTranslationNotFoundException,
  LanguageNotFoundException,
} from 'src/modules/brand/model/brand-error.model'
import type {
  CreateBrandBodyType,
  CreateBrandTranslationBodyType,
  UpdateBrandBodyType,
  UpdateBrandTranslationBodyType,
} from 'src/modules/brand/model/brand-request.model'
import type {
  CreateBrandResType,
  CreateBrandTranslationResType,
  GetAllBrandsResType,
  GetBrandDetailResType,
  GetBrandTranslationDetailResType,
  UpdateBrandResType,
  UpdateBrandTranslationResType,
} from 'src/modules/brand/model/brand-response.model'
import { BrandTranslationRepository } from 'src/modules/brand/repo/brand-translation.repo'
import { BrandRepository } from 'src/modules/brand/repo/brand.repo'
import type { PaginationQueryType } from 'src/shared/models/request.model'
import type { MessageResType } from 'src/shared/models/response.model'

@Injectable()
export class BrandService {
  constructor(
    private readonly brandRepository: BrandRepository,
    private readonly brandTranslationRepository: BrandTranslationRepository,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  // ==================== Brand Methods ====================

  async findAllBrands(query: PaginationQueryType): Promise<GetAllBrandsResType> {
    const { brands, total } = await this.brandRepository.findAll(query)

    return {
      data: brands,
      meta: {
        totalItems: total,
        currentPage: query.page,
        totalPages: Math.ceil(total / query.limit),
        itemsPerPage: query.limit,
      },
    }
  }

  async findOneBrand(brandId: number): Promise<GetBrandDetailResType> {
    const brand = await this.brandRepository.findByIdWithTranslations(brandId)
    if (!brand) {
      throw BrandNotFoundException
    }

    return { data: brand }
  }

  async createBrand(body: CreateBrandBodyType, currentUserId: number): Promise<CreateBrandResType> {
    // Check name conflict
    const existingBrand = await this.brandRepository.findByName(body.name)
    if (existingBrand) {
      throw BrandNameConflictException
    }

    // Create brand data following "Golden Rules"
    const createData: Prisma.BrandCreateInput = {
      name: body.name,
      logo: body.logo,
      createdBy: {
        connect: { id: currentUserId },
      },
      updatedBy: {
        connect: { id: currentUserId },
      },
    }

    const brand = await this.brandRepository.create(createData)
    return { data: brand }
  }

  async updateBrand(brandId: number, body: UpdateBrandBodyType, currentUserId: number): Promise<UpdateBrandResType> {
    // Check brand exists
    const existingBrand = await this.brandRepository.findByIdWithTranslations(brandId)
    if (!existingBrand) {
      throw BrandNotFoundException
    }

    // Check name conflict (if name is being updated)
    if (body.name !== undefined && body.name !== existingBrand.name) {
      const nameConflict = await this.brandRepository.findByName(body.name)
      if (nameConflict) {
        throw BrandNameConflictException
      }
    }

    // Update brand data following "Golden Rules" - map explicitly, no if checks
    const updateData: Prisma.BrandUpdateInput = {
      name: body.name,
      logo: body.logo,
      updatedBy: {
        connect: { id: currentUserId },
      },
    }

    const brand = await this.brandRepository.update(brandId, updateData)
    return { data: brand }
  }

  async removeBrand(brandId: number, currentUserId: number): Promise<MessageResType> {
    // Check brand exists
    const existingBrand = await this.brandRepository.findByIdWithTranslations(brandId)
    if (!existingBrand) {
      throw BrandNotFoundException
    }

    // Soft delete brand
    await this.brandRepository.softDelete(brandId, currentUserId)

    return {
      message: this.i18n.t('common.BrandDeletedSuccessfully'),
    }
  }

  // ==================== BrandTranslation Methods ====================

  async createBrandTranslation(
    brandId: number,
    body: CreateBrandTranslationBodyType,
    currentUserId: number,
  ): Promise<CreateBrandTranslationResType> {
    // Check brand exists
    const existingBrand = await this.brandRepository.findByIdWithTranslations(brandId)
    if (!existingBrand) {
      throw BrandNotFoundException
    }

    // Check language exists
    const languageExists = await this.brandTranslationRepository.languageExists(body.languageId)
    if (!languageExists) {
      throw LanguageNotFoundException
    }

    // Check translation conflict (same brand + same language)
    const existingTranslation = await this.brandTranslationRepository.findByBrandAndLanguage(brandId, body.languageId)
    if (existingTranslation) {
      throw BrandTranslationConflictException
    }

    // Create translation data following "Golden Rules"
    const createData: Prisma.BrandTranslationCreateInput = {
      name: body.name,
      description: body.description,
      brand: {
        connect: { id: brandId },
      },
      language: {
        connect: { id: body.languageId },
      },
      createdBy: {
        connect: { id: currentUserId },
      },
      updatedBy: {
        connect: { id: currentUserId },
      },
    }

    const translation = await this.brandTranslationRepository.create(createData)
    return { data: translation }
  }

  async findOneBrandTranslation(brandTranslationId: number): Promise<GetBrandTranslationDetailResType> {
    const translation = await this.brandTranslationRepository.findById(brandTranslationId)
    if (!translation) {
      throw BrandTranslationNotFoundException
    }

    return { data: translation }
  }

  async updateBrandTranslation(
    brandTranslationId: number,
    body: UpdateBrandTranslationBodyType,
    currentUserId: number,
  ): Promise<UpdateBrandTranslationResType> {
    // Check translation exists
    const existingTranslation = await this.brandTranslationRepository.findById(brandTranslationId)
    if (!existingTranslation) {
      throw BrandTranslationNotFoundException
    }

    // Update translation data following "Golden Rules" - map explicitly
    const updateData: Prisma.BrandTranslationUpdateInput = {
      name: body.name,
      description: body.description,
      updatedBy: {
        connect: { id: currentUserId },
      },
    }

    const translation = await this.brandTranslationRepository.update(brandTranslationId, updateData)
    return { data: translation }
  }

  async removeBrandTranslation(brandTranslationId: number, currentUserId: number): Promise<MessageResType> {
    // Check translation exists
    const existingTranslation = await this.brandTranslationRepository.findById(brandTranslationId)
    if (!existingTranslation) {
      throw BrandTranslationNotFoundException
    }

    // Soft delete translation
    await this.brandTranslationRepository.softDelete(brandTranslationId, currentUserId)

    return {
      message: this.i18n.t('common.BrandTranslationDeletedSuccessfully'),
    }
  }
}
