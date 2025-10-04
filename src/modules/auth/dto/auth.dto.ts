import { createZodDto } from 'nestjs-zod'

import { RegisterBodySchema, RegisterResSchema, SendOtpBodySchema } from 'src/modules/auth/model/auth.model'

export class RegisterBodyDto extends createZodDto(RegisterBodySchema) {}

export class RegisterResDto extends createZodDto(RegisterResSchema) {}

export class SendOtpBodyDto extends createZodDto(SendOtpBodySchema) {}
