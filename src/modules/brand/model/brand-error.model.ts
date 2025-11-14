import { BadRequestException, NotFoundException } from '@nestjs/common'

export const BrandNotFoundException = new NotFoundException([
  {
    message: 'errors.BrandNotFound',
    path: 'brandId',
  },
])

export const BrandNameConflictException = new BadRequestException([
  {
    message: 'errors.BrandNameAlreadyExists',
    path: 'name',
  },
])

export const BrandTranslationNotFoundException = new NotFoundException([
  {
    message: 'errors.BrandTranslationNotFound',
    path: 'brandTranslationId',
  },
])

export const BrandTranslationConflictException = new BadRequestException([
  {
    message: 'errors.BrandTranslationAlreadyExistsForThisLanguage',
    path: 'languageId',
  },
])

export const LanguageNotFoundException = new NotFoundException([
  {
    message: 'errors.LanguageNotFound',
    path: 'languageId',
  },
])
