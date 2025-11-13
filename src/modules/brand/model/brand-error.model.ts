import { BadRequestException, NotFoundException } from '@nestjs/common'

export const BrandNotFoundException = new NotFoundException([
  {
    message: 'Error.BrandNotFound',
    path: 'brandId',
  },
])

export const BrandNameConflictException = new BadRequestException([
  {
    message: 'Error.BrandNameAlreadyExists',
    path: 'name',
  },
])

export const BrandTranslationNotFoundException = new NotFoundException([
  {
    message: 'Error.BrandTranslationNotFound',
    path: 'brandTranslationId',
  },
])

export const BrandTranslationConflictException = new BadRequestException([
  {
    message: 'Error.BrandTranslationAlreadyExistsForThisLanguage',
    path: 'languageId',
  },
])

export const LanguageNotFoundException = new NotFoundException([
  {
    message: 'Error.LanguageNotFound',
    path: 'languageId',
  },
])
