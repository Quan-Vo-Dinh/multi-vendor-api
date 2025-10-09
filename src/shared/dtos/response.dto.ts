import { createZodDto } from 'nestjs-zod'

import { MessageResSchema } from 'src/shared/models/response.model'

export class ResponseDto extends createZodDto(MessageResSchema) {}
