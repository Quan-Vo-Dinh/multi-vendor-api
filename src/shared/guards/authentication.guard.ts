import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { firstValueFrom, isObservable } from 'rxjs'

import { AuthType, ConditionGuardType } from 'src/shared/constants/auth.constant'
import { AUTH_TYPE_KEY, AuthMetadataPayload } from 'src/shared/decorators/auth.decorator'

import { AccessTokenGuard } from './access-token.guard'
import { APIKeyGuard } from './api-key.guard'

// Composition Pattern - Super Guard
@Injectable()
export class AuthenticationGuard implements CanActivate {
  private authTypeGuardsMap: Record<AuthType, CanActivate>

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
    private readonly apiKeyGuard: APIKeyGuard,
  ) {
    this.authTypeGuardsMap = {
      [AuthType.Bearer]: this.accessTokenGuard,
      [AuthType.ApiKey]: this.apiKeyGuard,
      [AuthType.None]: { canActivate: () => true },
    }
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypeValue = this.reflector.getAllAndOverride<AuthMetadataPayload | undefined>(AUTH_TYPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? { authTypes: [AuthType.Bearer], options: { conditions: ConditionGuardType.OR } }

    const guards = authTypeValue.authTypes.map((type) => {
      const guard = this.authTypeGuardsMap[type]
      if (!guard) {
        throw new UnauthorizedException(`No guard found for auth type: ${type}`)
      }
      return { type, guard }
    })

    const results: { type: string; success: boolean; error?: any }[] = await Promise.all(
      guards.map(async ({ type, guard }) => {
        try {
          let success = await guard.canActivate(context)
          // Nếu là Observable thì convert về boolean
          if (isObservable(success)) {
            success = await firstValueFrom(success)
          }
          return { type, success }
        } catch (error) {
          return { type, success: false, error }
        }
      }),
    )

    if (authTypeValue.options.conditions === ConditionGuardType.OR) {
      if (results.some((r) => r.success)) {
        return true
      }
      // Nếu tất cả đều fail, trả về lỗi chi tiết
      throw new UnauthorizedException({
        message: 'All authentication methods failed',
        errors: results.map((r) => ({
          type: r.type,
          error: r.error?.message || r.error || 'Unknown error',
        })),
      })
    }

    // AND: tất cả phải pass
    if (results.every((r) => r.success)) {
      return true
    }
    // Nếu có guard fail, trả về lỗi chi tiết
    throw new UnauthorizedException({
      message: 'Some authentication methods failed',
      errors: results
        .filter((r) => !r.success)
        .map((r) => ({
          type: r.type,
          error: r.error?.message || r.error || 'Unknown error',
        })),
    })
  }
}
