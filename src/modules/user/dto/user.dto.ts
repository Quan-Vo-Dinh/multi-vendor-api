import { createZodDto } from 'nestjs-zod'

import {
  CreateUserBodySchema,
  PaginationQuerySchema,
  UpdateUserBodySchema,
  UserIdParamSchema,
} from '../model/user-request.model'
import {
  CreateUserResSchema,
  GetAllUsersResSchema,
  GetUserDetailResSchema,
  UpdateUserResSchema,
} from '../model/user-response.model'

// Request DTOs
export class CreateUserBodyDto extends createZodDto(CreateUserBodySchema) {}
export class UpdateUserBodyDto extends createZodDto(UpdateUserBodySchema) {}
export class UserIdParamDto extends createZodDto(UserIdParamSchema) {}
export class PaginationQueryDto extends createZodDto(PaginationQuerySchema) {}

// Response DTOs
export class GetAllUsersResDto extends createZodDto(GetAllUsersResSchema) {}
export class GetUserDetailResDto extends createZodDto(GetUserDetailResSchema) {}
export class CreateUserResDto extends createZodDto(CreateUserResSchema) {}
export class UpdateUserResDto extends createZodDto(UpdateUserResSchema) {}
