import { UnprocessableEntityException } from '@nestjs/common'

export const InvalidOtpException = new UnprocessableEntityException([
  {
    message: 'Error.InvalidOTP',
    path: 'code',
  },
])

export const OtpExpiredException = new UnprocessableEntityException([
  {
    message: 'Error.OTPExpired',
    path: 'code',
  },
])

export const FailedToSendOtpException = new UnprocessableEntityException([
  {
    message: 'Error.FailedToSendOTP',
    path: 'code',
  },
])

export const EmailAlreadyExistsException = new UnprocessableEntityException([
  {
    message: 'Error.EmailAlreadyExists',
    path: 'email',
  },
])

export const EmailNotFoundException = new UnprocessableEntityException([
  {
    message: 'Error.EmailNotFound',
    path: 'email',
  },
])

export const InvalidPasswordException = new UnprocessableEntityException([
  {
    message: 'Error.InvalidPassword',
    path: 'password',
  },
])

export const RefreshTokenAlreadyUsedException = new UnprocessableEntityException([
  {
    message: 'Error.RefreshTokenAlreadyUsed',
    path: 'refreshToken',
  },
])

export const UnauthorizedException = new UnprocessableEntityException('Error.Unauthorized')
