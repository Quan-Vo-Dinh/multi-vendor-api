import { ConflictException, NotFoundException, UnprocessableEntityException } from '@nestjs/common'

export const PermissionNotFoundException = new NotFoundException([
  {
    message: 'Error.PermissionNotFound',
    path: 'permissionId',
  },
])

export const PermissionNameAlreadyExistsException = new ConflictException([
  {
    message: 'Error.PermissionNameAlreadyExists',
    path: 'name',
  },
])

export const PermissionPathMethodAlreadyExistsException = new ConflictException([
  {
    message: 'Error.PermissionPathMethodAlreadyExists',
    path: 'path',
  },
])

export const PermissionNameRequiredException = new UnprocessableEntityException([
  {
    message: 'Error.PermissionNameRequired',
    path: 'name',
  },
])

export const PermissionPathRequiredException = new UnprocessableEntityException([
  {
    message: 'Error.PermissionPathRequired',
    path: 'path',
  },
])

export const PermissionMethodRequiredException = new UnprocessableEntityException([
  {
    message: 'Error.PermissionMethodRequired',
    path: 'method',
  },
])
