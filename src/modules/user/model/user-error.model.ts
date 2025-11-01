import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common'

export const UserNotFoundException = new NotFoundException([
  {
    message: 'Error.UserNotFound',
    path: 'userId',
  },
])

export const UserEmailConflictException = new BadRequestException([
  {
    message: 'Error.UserEmailAlreadyExists',
    path: 'email',
  },
])

export const RoleNotFoundException = new NotFoundException([
  {
    message: 'Error.RoleNotFound',
    path: 'roleId',
  },
])

export const AdminProtectionException = new ForbiddenException([
  {
    message: 'Error.OnlyAdminCanManageAdminRole',
    path: 'roleId',
  },
])

export const SelfActionForbiddenException = new ForbiddenException([
  {
    message: 'Error.CannotPerformActionOnYourself',
    path: 'userId',
  },
])
