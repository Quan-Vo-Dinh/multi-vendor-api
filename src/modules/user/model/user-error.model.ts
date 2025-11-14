import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common'

export const UserNotFoundException = new NotFoundException([
  {
    message: 'errors.UserNotFound',
    path: 'userId',
  },
])

export const UserEmailConflictException = new BadRequestException([
  {
    message: 'errors.UserEmailAlreadyExists',
    path: 'email',
  },
])

export const RoleNotFoundException = new NotFoundException([
  {
    message: 'errors.RoleNotFound',
    path: 'roleId',
  },
])

export const AdminProtectionException = new ForbiddenException([
  {
    message: 'errors.OnlyAdminCanManageAdminRole',
    path: 'roleId',
  },
])

export const SelfActionForbiddenException = new ForbiddenException([
  {
    message: 'errors.CannotPerformActionOnYourself',
    path: 'userId',
  },
])
