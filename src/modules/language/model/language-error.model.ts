import { ConflictException, NotFoundException, UnprocessableEntityException } from '@nestjs/common'

export const LanguageNotFoundException = new NotFoundException([
  {
    message: 'errors.LanguageNotFound',
    path: 'languageId',
  },
])

export const LanguageIdAlreadyExistsException = new ConflictException([
  {
    message: 'errors.LanguageIdAlreadyExists',
    path: 'id',
  },
])

export const LanguageIdRequiredException = new UnprocessableEntityException([
  {
    message: 'errors.LanguageIdRequired',
    path: 'id',
  },
])

export const LanguageNameRequiredException = new UnprocessableEntityException([
  {
    message: 'errors.LanguageNameRequired',
    path: 'name',
  },
])
