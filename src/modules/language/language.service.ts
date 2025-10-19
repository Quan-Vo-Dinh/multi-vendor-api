import { Injectable } from '@nestjs/common'

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
  constructor(private readonly languageRepository: LanguageRepository) {}

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

    const language = await this.languageRepository.create({
      ...body,
      createdById: userId,
    })

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

    const updatedLanguage = await this.languageRepository.update(languageId, {
      ...body,
      updatedById: userId,
    })

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
      message: 'Language deleted successfully',
    }
  }
}
