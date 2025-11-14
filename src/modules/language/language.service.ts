import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { I18nService } from 'nestjs-i18n'

import type { I18nTranslations } from 'src/generated/types/i18n.generated'

import { LanguageIdAlreadyExistsException, LanguageNotFoundException } from './model/language-error.model'
import type { CreateLanguageBodyType, UpdateLanguageBodyType } from './model/language-request.model'
import type {
  CreateLanguageResType,
  GetAllLanguagesResType,
  GetLanguageDetailResType,
  UpdateLanguageResType,
} from './model/language-response.model'
import { LanguageRepository } from './repo/language.repo'

@Injectable()
export class LanguageService {
  constructor(
    private readonly languageRepository: LanguageRepository,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  async findAll(): Promise<GetAllLanguagesResType> {
    const languages = await this.languageRepository.findAll()
    return {
      data: languages,
      totalItem: languages.length,
    }
  }

  async findOne(languageId: string): Promise<GetLanguageDetailResType> {
    const language = await this.languageRepository.findById(languageId)

    if (!language) {
      throw LanguageNotFoundException
    }

    return {
      data: language,
    }
  }

  async create(body: CreateLanguageBodyType, userId: number): Promise<CreateLanguageResType> {
    // Check if language ID already exists
    const existingLanguage = await this.languageRepository.existsById(body.id)
    if (existingLanguage) {
      throw LanguageIdAlreadyExistsException
    }

    const dataToCreate: Prisma.LanguageCreateInput = {
      id: body.id,
      name: body.name,
      createdBy: {
        connect: { id: userId },
      },
    }

    const language = await this.languageRepository.create(dataToCreate)

    return {
      data: language,
    }
  }

  async update(languageId: string, body: UpdateLanguageBodyType, userId: number): Promise<UpdateLanguageResType> {
    // Check if language exists
    const existingLanguage = await this.languageRepository.findById(languageId)
    if (!existingLanguage) {
      throw LanguageNotFoundException
    }

    const dataToUpdate: Prisma.LanguageUpdateInput = {
      name: body.name,
      updatedBy: {
        connect: { id: userId },
      },
    }

    const updatedLanguage = await this.languageRepository.update(languageId, dataToUpdate)

    return {
      data: updatedLanguage,
    }
  }

  async remove(languageId: string): Promise<{ message: string }> {
    // Check if language exists
    const existingLanguage = await this.languageRepository.findById(languageId)
    if (!existingLanguage) {
      throw LanguageNotFoundException
    }

    await this.languageRepository.delete(languageId)

    return {
      message: this.i18n.t('common.LanguageDeletedSuccessfully'),
    }
  }
}
