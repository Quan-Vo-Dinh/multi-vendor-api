import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { RoleName } from 'src/shared/constants/role.constant'

import {
  InvalidPermissionIdsException,
  ProhibitedRoleDeletionException,
  ProhibitedRoleUpdateException,
  RoleNameAlreadyExistsException,
  RoleNotFoundException,
} from './model/role-error.model'
import type { CreateRoleBodyType, PaginationQueryType, UpdateRoleBodyType } from './model/role-request.model'
import type {
  CreateRoleResType,
  GetAllRolesResType,
  GetRoleDetailResType,
  UpdateRoleResType,
} from './model/role-response.model'
import { RoleRepository } from './repo/role.repo'

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async findAll(query: PaginationQueryType): Promise<GetAllRolesResType> {
    const { page, limit } = query
    const skip = (page - 1) * limit
    const take = limit

    const { data, total } = await this.roleRepository.findAll(skip, take)

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

  async findOne(roleId: number): Promise<GetRoleDetailResType> {
    const role = await this.roleRepository.findByIdWithPermissions(roleId)

    if (!role) {
      throw RoleNotFoundException
    }

    return {
      data: role,
    }
  }

  async create(body: CreateRoleBodyType, userId: number): Promise<CreateRoleResType> {
    // Check if role with same name already exists
    const existingRole = await this.roleRepository.existsByName(body.name)
    if (existingRole) {
      throw RoleNameAlreadyExistsException
    }

    // Validate permission IDs if provided
    if (body.permissionIds && body.permissionIds.length > 0) {
      const permissionsExist = await this.roleRepository.validatePermissionIds(body.permissionIds)
      if (!permissionsExist) {
        throw InvalidPermissionIdsException
      }
    }

    const dataToCreate: Prisma.RoleCreateInput = {
      name: body.name,
      description: body.description,
      isActive: body.isActive,
      createdBy: {
        connect: { id: userId },
      },
      // Connect permissions if provided
      ...(body.permissionIds &&
        body.permissionIds.length > 0 && {
          permissions: {
            connect: body.permissionIds.map((id) => ({ id })),
          },
        }),
    }

    const role = await this.roleRepository.create(dataToCreate)

    return {
      data: role,
    }
  }

  async update(roleId: number, body: UpdateRoleBodyType, userId: number): Promise<UpdateRoleResType> {
    const existingRole = await this.roleRepository.findById(roleId)
    if (!existingRole) {
      throw RoleNotFoundException
    }

    // Không cho phép bất kỳ ai cập nhật Super Admin role
    if (existingRole.name === RoleName.SUPER_ADMIN) {
      throw ProhibitedRoleUpdateException
    }

    // If updating name, check for conflicts
    if (body.name) {
      const nameConflictExists = await this.roleRepository.existsByName(body.name, roleId)
      if (nameConflictExists) {
        throw RoleNameAlreadyExistsException
      }
    }

    // Validate permission IDs if provided
    if (body.permissionIds !== undefined) {
      if (body.permissionIds.length > 0) {
        const permissionsExist = await this.roleRepository.validatePermissionIds(body.permissionIds)
        if (!permissionsExist) {
          throw InvalidPermissionIdsException
        }
      }
    }

    const dataToUpdate: Prisma.RoleUpdateInput = {
      name: body.name,
      description: body.description,
      isActive: body.isActive,
      updatedBy: {
        connect: { id: userId },
      },
      // Handle permissions update if provided
      ...(body.permissionIds !== undefined && {
        permissions: {
          set: [], // Clear existing connections first
          connect: body.permissionIds.map((id) => ({ id })),
        },
      }),
    }

    const updatedRole = await this.roleRepository.update(roleId, dataToUpdate)

    return {
      data: updatedRole,
    }
  }

  async remove(roleId: number, userId: number): Promise<{ message: string }> {
    const existingRole = await this.roleRepository.findById(roleId)
    if (!existingRole) {
      throw RoleNotFoundException
    }
    // không cho phép xóa 4 role cơ bản: Super Admin, Admin, Seller, Customer
    const baseRoles: string[] = [RoleName.ADMIN, RoleName.SUPER_ADMIN, RoleName.SELLER, RoleName.CUSTOMER]
    if (baseRoles.includes(existingRole.name)) {
      throw ProhibitedRoleDeletionException
    }

    await this.roleRepository.softDelete(roleId, userId)

    return {
      message: 'Role deleted successfully',
    }
  }
}
