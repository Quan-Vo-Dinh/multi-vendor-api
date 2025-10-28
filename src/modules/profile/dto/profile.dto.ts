import { createZodDto } from 'nestjs-zod'

import { ChangePasswordBodySchema, UpdateProfileBodySchema } from '../model/profile-request.model'
import { GetProfileResSchema, UpdateProfileResSchema } from '../model/profile-response.model'

// Request DTOs
export class UpdateProfileBodyDto extends createZodDto(UpdateProfileBodySchema) {}
export class ChangePasswordBodyDto extends createZodDto(ChangePasswordBodySchema) {}

// Response DTOs
export class GetProfileResDto extends createZodDto(GetProfileResSchema) {}
export class UpdateProfileResDto extends createZodDto(UpdateProfileResSchema) {}
