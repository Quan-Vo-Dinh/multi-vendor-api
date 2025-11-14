import { ConflictException, ForbiddenException, NotFoundException, UnprocessableEntityException } from '@nestjs/common'

export const RoleNotFoundException = new NotFoundException([
  {
    message: 'errors.RoleNotFound',
    path: 'roleId',
  },
])

export const RoleNameAlreadyExistsException = new ConflictException([
  {
    message: 'errors.RoleNameAlreadyExists',
    path: 'name',
  },
])

export const RoleNameRequiredException = new UnprocessableEntityException([
  {
    message: 'errors.RoleNameRequired',
    path: 'name',
  },
])

export const InvalidPermissionIdsException = new UnprocessableEntityException([
  {
    message: 'errors.InvalidPermissionIds',
    path: 'permissionIds',
  },
])

export const ProhibitedRoleDeletionException = new ForbiddenException([
  {
    message: 'errors.ProhibitedRoleDeletion',
    path: 'roleId',
  },
])

export const ProhibitedRoleUpdateException = new ForbiddenException([
  {
    message: 'errors.ProhibitedRoleUpdate',
    path: 'roleId',
  },
])
