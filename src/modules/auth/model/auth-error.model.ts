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

export const TOTPAlreadyEnabledException = new UnprocessableEntityException([
  {
    message: 'Error.TOTPAlreadyEnabled',
    path: 'totpCode',
  },
])

export const TOTPNotEnabledException = new UnprocessableEntityException([
  {
    message: 'Error.TOTPNotEnabled',
    path: 'totpCode',
  },
])

export const InvalidTOTPAndCodeException = new UnprocessableEntityException([
  {
    message: 'Error.InvalidTOTPAndCode',
    path: 'totpCode',
  },
  {
    message: 'Error.InvalidTOTPAndCode',
    path: 'code',
  },
])

export const TOTPCodeExpiredException = new UnprocessableEntityException([
  {
    message: 'Error.TOTPCodeExpired',
    path: 'totpCode',
  },
])

export const InvalidTempIdException = new UnprocessableEntityException([
  {
    message: 'Error.InvalidTempId',
    path: 'tempId',
  },
])

export const InvalidTempSessionException = new UnprocessableEntityException([
  {
    message: 'Error.InvalidTempSession',
    path: 'tempSessionId',
  },
])

export const InvalidTOTPTokenException = new UnprocessableEntityException([
  {
    message: 'Error.InvalidTOTPToken',
    path: 'token',
  },
])
