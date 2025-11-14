import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { I18nService } from 'nestjs-i18n'

import type { I18nTranslations } from 'src/generated/types/i18n.generated'

import { PermissionNotFoundException, PermissionPathMethodAlreadyExistsException } from './model/permission-error.model'
import type {
  CreatePermissionBodyType,
  PaginationQueryType,
  UpdatePermissionBodyType,
} from './model/permission-request.model'
import type {
  CreatePermissionResType,
  GetAllPermissionsResType,
  GetPermissionDetailResType,
  UpdatePermissionResType,
} from './model/permission-response.model'
import { PermissionRepository } from './repo/permission.repo'

@Injectable()
export class PermissionService {
  constructor(
    private readonly permissionRepository: PermissionRepository,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  async findAll(query: PaginationQueryType): Promise<GetAllPermissionsResType> {
    const { page, limit } = query
    const skip = (page - 1) * limit
    const take = limit

    const { data, total } = await this.permissionRepository.findAll(skip, take)

    const totalPages = Math.ceil(total / limit)

    return {
      data,
      meta: {
        totalItems: total,
        currentPage: page,
        totalPages,
        itemsPerPage: limit,
      },
    }
  }

  async findOne(permissionId: number): Promise<GetPermissionDetailResType> {
    const permission = await this.permissionRepository.findById(permissionId)

    if (!permission) {
      throw PermissionNotFoundException
    }

    return {
      data: permission,
    }
  }

  async create(body: CreatePermissionBodyType, userId: number): Promise<CreatePermissionResType> {
    // Check if permission with same path and method already exists
    const existingPermission = await this.permissionRepository.existsByPathAndMethod(body.path, body.method)
    if (existingPermission) {
      throw PermissionPathMethodAlreadyExistsException
    }

    const dataToCreate: Prisma.PermissionCreateInput = {
      name: body.name,
      description: body.description,
      path: body.path,
      method: body.method,
      module: body.module,
      createdBy: {
        connect: { id: userId },
      },
    }

    const permission = await this.permissionRepository.create(dataToCreate)

    return {
      data: permission,
    }
  }

  async update(permissionId: number, body: UpdatePermissionBodyType, userId: number): Promise<UpdatePermissionResType> {
    // Check if permission exists
    const existingPermission = await this.permissionRepository.findById(permissionId)
    if (!existingPermission) {
      throw PermissionNotFoundException
    }

    // If updating path or method, check for conflicts
    if (body.path || body.method) {
      const pathToCheck = body.path || existingPermission.path
      const methodToCheck = body.method || existingPermission.method
      const conflictExists = await this.permissionRepository.existsByPathAndMethod(
        pathToCheck,
        methodToCheck,
        permissionId,
      )
      if (conflictExists) {
        throw PermissionPathMethodAlreadyExistsException
      }
    }

    const dataToUpdate: Prisma.PermissionUpdateInput = {
      name: body.name,
      description: body.description,
      path: body.path,
      method: body.method,
      module: body.module,
      updatedBy: {
        connect: { id: userId },
      },
    }

    const updatedPermission = await this.permissionRepository.update(permissionId, dataToUpdate)

    return {
      data: updatedPermission,
    }
  }

  async remove(permissionId: number, userId: number): Promise<{ message: string }> {
    // Check if permission exists
    const existingPermission = await this.permissionRepository.findById(permissionId)
    if (!existingPermission) {
      throw PermissionNotFoundException
    }

    await this.permissionRepository.softDelete(permissionId, userId)

    return {
      message: this.i18n.t('common.PermissionDeletedSuccessfully'),
    }
  }
}
