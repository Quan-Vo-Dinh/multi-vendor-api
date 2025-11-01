import { Injectable } from '@nestjs/common'
import type { Prisma } from '@prisma/client'

import {
  AdminProtectionException,
  RoleNotFoundException,
  SelfActionForbiddenException,
  UserEmailConflictException,
  UserNotFoundException,
} from 'src/modules/user/model/user-error.model'
import type { CreateUserBodyType, UpdateUserBodyType } from 'src/modules/user/model/user-request.model'
import type {
  CreateUserResType,
  GetAllUsersResType,
  GetUserDetailResType,
  UpdateUserResType,
} from 'src/modules/user/model/user-response.model'
import { UserRepository } from 'src/modules/user/repo/user.repo'
import { RoleName } from 'src/shared/constants/role.constant'
import type { PaginationQueryType } from 'src/shared/models/request.model'
import type { MessageResType } from 'src/shared/models/response.model'
import { HashingService } from 'src/shared/services/hashing.service'

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashingService: HashingService,
  ) {}

  // Helper: Kiểm tra role có phải là Admin không
  private async isAdminRole(roleId: number): Promise<boolean> {
    const role = await this.userRepository.getRoleById(roleId)
    return role?.name === RoleName.ADMIN
  }

  // Helper: Kiểm tra user có phải là Admin không (theo user ID)
  private async isUserAdmin(userId: number): Promise<boolean> {
    const user = await this.userRepository.findByIdWithRole(userId)
    if (!user) return false
    return user.role.name === RoleName.ADMIN
  }

  // Business Rule: Chỉ Admin mới được thao tác với Admin role
  private async validateAdminRoleOperation(roleId: number, currentUserId: number): Promise<void> {
    const isTargetRoleAdmin = await this.isAdminRole(roleId)
    if (isTargetRoleAdmin) {
      const isCurrentUserAdmin = await this.isUserAdmin(currentUserId)
      if (!isCurrentUserAdmin) {
        throw AdminProtectionException
      }
    }
  }

  // Business Rule: User không được tự thao tác trên chính mình
  private validateSelfAction(targetUserId: number, currentUserId: number): void {
    if (targetUserId === currentUserId) {
      throw SelfActionForbiddenException
    }
  }

  // Business Rule: Chỉ Admin mới được xóa Admin khác
  private async validateAdminDeletion(targetUserId: number, currentUserId: number): Promise<void> {
    const isTargetUserAdmin = await this.isUserAdmin(targetUserId)
    if (isTargetUserAdmin) {
      const isCurrentUserAdmin = await this.isUserAdmin(currentUserId)
      if (!isCurrentUserAdmin) {
        throw AdminProtectionException
      }
    }
  }

  async findAll(query: PaginationQueryType): Promise<GetAllUsersResType> {
    const { users, total } = await this.userRepository.findAll(query)

    return {
      data: users,
      meta: {
        totalItems: total,
        currentPage: query.page,
        totalPages: Math.ceil(total / query.limit),
        itemsPerPage: query.limit,
      },
    }
  }

  async findOne(userId: number): Promise<GetUserDetailResType> {
    const user = await this.userRepository.findByIdWithRole(userId)
    if (!user) {
      throw UserNotFoundException
    }

    return { data: user }
  }

  async create(body: CreateUserBodyType, currentUserId: number): Promise<CreateUserResType> {
    // Check role exists
    const roleExists = await this.userRepository.roleExists(body.roleId)
    if (!roleExists) {
      throw RoleNotFoundException
    }

    // Business Rule: Only Admin can create user with Admin role
    await this.validateAdminRoleOperation(body.roleId, currentUserId)

    // Check email conflict
    const existingUser = await this.userRepository.findByEmail(body.email)
    if (existingUser) {
      throw UserEmailConflictException
    }

    // Hash password
    const hashedPassword = await this.hashingService.hash(body.password)

    const createData: Prisma.UserCreateInput = {
      email: body.email,
      name: body.name,
      password: hashedPassword,
      phoneNumber: body.phoneNumber,
      avatar: body.avatar ?? null,
      status: body.status,
      role: {
        connect: { id: body.roleId },
      },
      createdBy: {
        connect: { id: currentUserId },
      },
      updatedBy: {
        connect: { id: currentUserId },
      },
    }

    const user = await this.userRepository.create(createData)
    return { data: user }
  }

  async update(userId: number, body: UpdateUserBodyType, currentUserId: number): Promise<UpdateUserResType> {
    // Check user exists
    const existingUser = await this.userRepository.findByIdWithRole(userId)
    if (!existingUser) {
      throw UserNotFoundException
    }

    // Business Rule: Cannot update yourself
    this.validateSelfAction(userId, currentUserId)

    // If roleId is being updated, check role exists and Admin protection
    if (body.roleId !== undefined) {
      const roleExists = await this.userRepository.roleExists(body.roleId)
      if (!roleExists) {
        throw RoleNotFoundException
      }

      // Business Rule: Only Admin can update user to Admin role
      await this.validateAdminRoleOperation(body.roleId, currentUserId)
    }

    // Check email conflict (if email is being updated)
    if (body.email !== undefined && body.email !== existingUser.email) {
      const emailConflict = await this.userRepository.findByEmail(body.email)
      if (emailConflict) {
        throw UserEmailConflictException
      }
    }

    // Hash password if provided
    const hashedPassword = body.password !== undefined ? await this.hashingService.hash(body.password) : undefined

    const updateData: Prisma.UserUpdateInput = {
      email: body.email,
      name: body.name,
      password: hashedPassword,
      phoneNumber: body.phoneNumber,
      avatar: body.avatar,
      status: body.status,
      role: body.roleId !== undefined ? { connect: { id: body.roleId } } : undefined,
      updatedBy: {
        connect: { id: currentUserId },
      },
    }

    const user = await this.userRepository.update(userId, updateData)
    return { data: user }
  }

  async remove(userId: number, currentUserId: number): Promise<MessageResType> {
    // Check user exists
    const existingUser = await this.userRepository.findByIdWithRole(userId)
    if (!existingUser) {
      throw UserNotFoundException
    }

    // Business Rule: Cannot delete yourself
    this.validateSelfAction(userId, currentUserId)

    // Business Rule: Only Admin can delete another Admin
    await this.validateAdminDeletion(userId, currentUserId)

    await this.userRepository.softDelete(userId, currentUserId)

    return {
      message: 'User deleted successfully',
    }
  }
}
