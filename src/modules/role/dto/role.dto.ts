import { createZodDto } from 'nestjs-zod'

import {
  CreateRoleBodySchema,
  PaginationQuerySchema,
  RoleIdParamSchema,
  UpdateRoleBodySchema,
} from '../model/role-request.model'
import type {
  CreateRoleResType,
  GetAllRolesResType,
  GetRoleDetailResType,
  UpdateRoleResType,
} from '../model/role-response.model'
import {
  CreateRoleResSchema,
  GetAllRolesResSchema,
  GetRoleDetailResSchema,
  UpdateRoleResSchema,
} from '../model/role-response.model'

// Request DTOs
export class CreateRoleBodyDto extends createZodDto(CreateRoleBodySchema) {}

export class UpdateRoleBodyDto extends createZodDto(UpdateRoleBodySchema) {}

export class RoleIdParamDto extends createZodDto(RoleIdParamSchema) {}

export class PaginationQueryDto extends createZodDto(PaginationQuerySchema) {}

// Response DTOs
export class GetAllRolesResDto extends createZodDto(GetAllRolesResSchema) {}

export class GetRoleDetailResDto extends createZodDto(GetRoleDetailResSchema) {}

export class CreateRoleResDto extends createZodDto(CreateRoleResSchema) {}

export class UpdateRoleResDto extends createZodDto(UpdateRoleResSchema) {}

// Export types for convenience
export type { CreateRoleResType, GetAllRolesResType, GetRoleDetailResType, UpdateRoleResType }
