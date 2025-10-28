import { SetMetadata } from '@nestjs/common'

export const SKIP_AUTHORIZATION_KEY = 'skipAuthorization'

/**
 * Decorator to skip ALL authorization checks for a route
 * Use this for routes that require authentication but not authorization
 *
 * This is more semantic than @SkipPermission() because it applies to
 * ALL authorization strategies (permission, role, ownership, etc.)
 *
 * @example
 * ```typescript
 * @Get('profile')
 * @SkipAuthorization()
 * getProfile(@ActiveUser() user: AccessTokenPayload) {
 *   return this.userService.getProfile(user.userId)
 * }
 * ```
 */
export const SkipAuthorization = () => SetMetadata(SKIP_AUTHORIZATION_KEY, true)
