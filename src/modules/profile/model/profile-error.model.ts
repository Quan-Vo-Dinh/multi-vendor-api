import { BadRequestException, NotFoundException } from '@nestjs/common'

export const UserNotFoundException = new NotFoundException([
  {
    message: 'Error.UserNotFound',
    path: 'userId',
  },
])

export const InvalidPasswordException = new BadRequestException([
  {
    message: 'Error.InvalidPassword',
    path: 'oldPassword',
  },
])
