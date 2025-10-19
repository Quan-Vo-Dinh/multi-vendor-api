import { ConflictException, NotFoundException, UnprocessableEntityException } from '@nestjs/common'

export const LanguageNotFoundException = new NotFoundException([
  {
    message: 'Error.LanguageNotFound',
    path: 'languageId',
  },
])

export const LanguageIdAlreadyExistsException = new ConflictException([
  {
    message: 'Error.LanguageIdAlreadyExists',
    path: 'id',
  },
])

export const LanguageIdRequiredException = new UnprocessableEntityException([
  {
    message: 'Error.LanguageIdRequired',
    path: 'id',
  },
])

export const LanguageNameRequiredException = new UnprocessableEntityException([
  {
    message: 'Error.LanguageNameRequired',
    path: 'name',
  },
])
