import { ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'

import { REQUEST_USER_KEY } from 'src/shared/constants/auth.constant'
import { PrismaService } from 'src/shared/services/prisma.service'
import { AccessTokenPayload } from 'src/shared/types/jwt.type'

/**
 * Permission-based Authorization Strategy
 * Checks if user's role has the required permission for the route
 */
@Injectable()
export class PermissionStrategy {
  constructor(private readonly prismaService: PrismaService) {}

  async check(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const user: AccessTokenPayload | undefined = request[REQUEST_USER_KEY]

    // No user means authentication hasn't happened
    if (!user) {
      return true // Let AuthenticationGuard handle this
    }

    const routePath = request.route?.path
    const method = request.method

    if (!routePath) {
      return true // No route path to check
    }

    // Query role with permissions
    const role = await this.prismaService.role.findUnique({
      where: { id: user.roleId, deletedAt: null },
      include: {
        permissions: {
          where: {
            deletedAt: null,
            path: routePath,
            method,
          },
        },
      },
    })

    const hasPermission = role && role.permissions.length > 0

    if (!hasPermission) {
      throw new ForbiddenException({
        message: 'Insufficient permissions to access this resource',
        details: {
          requiredPermission: `${method} ${routePath}`,
          userRole: user.roleName,
        },
      })
    }

    return true
  }
}
