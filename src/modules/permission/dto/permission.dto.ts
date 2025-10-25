import { createZodDto } from 'nestjs-zod'

import {
  CreatePermissionBodySchema,
  PaginationQuerySchema,
  PermissionIdParamSchema,
  UpdatePermissionBodySchema,
} from '../model/permission-request.model'
import type {
  CreatePermissionResType,
  GetAllPermissionsResType,
  GetPermissionDetailResType,
  UpdatePermissionResType,
} from '../model/permission-response.model'
import {
  CreatePermissionResSchema,
  GetAllPermissionsResSchema,
  GetPermissionDetailResSchema,
  UpdatePermissionResSchema,
} from '../model/permission-response.model'

// Request DTOs
export class CreatePermissionBodyDto extends createZodDto(CreatePermissionBodySchema) {}

export class UpdatePermissionBodyDto extends createZodDto(UpdatePermissionBodySchema) {}

export class PermissionIdParamDto extends createZodDto(PermissionIdParamSchema) {}

export class PaginationQueryDto extends createZodDto(PaginationQuerySchema) {}

// Response DTOs
export class GetAllPermissionsResDto extends createZodDto(GetAllPermissionsResSchema) {}

export class GetPermissionDetailResDto extends createZodDto(GetPermissionDetailResSchema) {}

export class CreatePermissionResDto extends createZodDto(CreatePermissionResSchema) {}

export class UpdatePermissionResDto extends createZodDto(UpdatePermissionResSchema) {}

// Export types for convenience
export type { CreatePermissionResType, GetAllPermissionsResType, GetPermissionDetailResType, UpdatePermissionResType }
