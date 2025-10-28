import { SetMetadata } from '@nestjs/common'

export const SKIP_PERMISSION_KEY = 'skipPermission'

/**
 * Decorator to skip permission check for a route
 * Use this for routes that require authentication but not specific permissions
 *
 * @example
 * ```typescript
 * @Get('profile')
 * @SkipPermission()
 * getProfile(@ActiveUser() user: AccessTokenPayload) {
 *   return this.userService.getProfile(user.userId)
 * }
 * ```
 */
export const SkipPermission = () => SetMetadata(SKIP_PERMISSION_KEY, true)
