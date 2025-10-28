import { ConflictException, ForbiddenException, NotFoundException, UnprocessableEntityException } from '@nestjs/common'

export const RoleNotFoundException = new NotFoundException([
  {
    message: 'Error.RoleNotFound',
    path: 'roleId',
  },
])

export const RoleNameAlreadyExistsException = new ConflictException([
  {
    message: 'Error.RoleNameAlreadyExists',
    path: 'name',
  },
])

export const RoleNameRequiredException = new UnprocessableEntityException([
  {
    message: 'Error.RoleNameRequired',
    path: 'name',
  },
])

export const InvalidPermissionIdsException = new UnprocessableEntityException([
  {
    message: 'Error.InvalidPermissionIds',
    path: 'permissionIds',
  },
])

export const ProhibitedRoleDeletionException = new ForbiddenException([
  {
    message: 'Error.ProhibitedRoleDeletion',
    path: 'roleId',
  },
])

export const ProhibitedRoleUpdateException = new ForbiddenException([
  {
    message: 'Error.ProhibitedRoleUpdate',
    path: 'roleId',
  },
])
