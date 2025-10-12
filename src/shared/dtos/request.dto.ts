import { createZodDto } from 'nestjs-zod'

import { emptyBodySchema } from '../models/request.model'

export class EmptyBodyDto extends createZodDto(emptyBodySchema) {}
