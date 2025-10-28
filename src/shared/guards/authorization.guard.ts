import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { SKIP_AUTHORIZATION_KEY } from 'src/shared/decorators/skip-authorization.decorator'

import { PermissionStrategy } from './strategies/permission.strategy'

/**
 * Authorization Guard (Composite Pattern)
 *
 * Handles all authorization strategies:
 * - Permission-based (current)
 * - Role-based (future)
 * - Resource ownership (future)
 * - ABAC (future)
 *
 * This guard runs AFTER AuthenticationGuard
 */
@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionStrategy: PermissionStrategy,
    // Future strategies can be injected here:
    // private readonly roleStrategy: RoleStrategy,
    // private readonly ownershipStrategy: OwnershipStrategy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if authorization should be skipped
    const skipAuthorization = this.reflector.getAllAndOverride<boolean>(SKIP_AUTHORIZATION_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (skipAuthorization) {
      return true
    }

    // For now, we only use permission-based strategy
    // In the future, we can check metadata to decide which strategy to use
    return await this.permissionStrategy.check(context)

    // Future implementation example:
    /*
    const authStrategy = this.reflector.get<AuthStrategy>('authStrategy', context.getHandler())
    
    switch (authStrategy) {
      case AuthStrategy.Permission:
        return await this.permissionStrategy.check(context)
      case AuthStrategy.Role:
        return await this.roleStrategy.check(context)
      case AuthStrategy.Ownership:
        return await this.ownershipStrategy.check(context)
      default:
        return await this.permissionStrategy.check(context)
    }
    */
  }
}
