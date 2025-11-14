import { ConflictException, NotFoundException, UnprocessableEntityException } from '@nestjs/common'

export const PermissionNotFoundException = new NotFoundException([
  {
    message: 'errors.PermissionNotFound',
    path: 'permissionId',
  },
])

export const PermissionNameAlreadyExistsException = new ConflictException([
  {
    message: 'errors.PermissionNameAlreadyExists',
    path: 'name',
  },
])

export const PermissionPathMethodAlreadyExistsException = new ConflictException([
  {
    message: 'errors.PermissionPathMethodAlreadyExists',
    path: 'path',
  },
])

export const PermissionNameRequiredException = new UnprocessableEntityException([
  {
    message: 'errors.PermissionNameRequired',
    path: 'name',
  },
])

export const PermissionPathRequiredException = new UnprocessableEntityException([
  {
    message: 'errors.PermissionPathRequired',
    path: 'path',
  },
])

export const PermissionMethodRequiredException = new UnprocessableEntityException([
  {
    message: 'errors.PermissionMethodRequired',
    path: 'method',
  },
])
