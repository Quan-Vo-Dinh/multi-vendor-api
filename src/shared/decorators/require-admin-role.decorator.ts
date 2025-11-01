import { SetMetadata } from '@nestjs/common'

export const REQUIRE_ADMIN_ROLE_KEY = 'requireAdminRole'

/**
 * Decorator to mark routes that require Admin role
 * Used for business logic validation in Service layer
 *
 * This is for BUSINESS RULES, not authentication/authorization
 * Example: Only Admin can create/update/delete another Admin
 *
 * @example
 * ```typescript
 * @Post()
 * @RequireAdminRole()
 * createUser(@Body() body: CreateUserBodyDto, @ActiveUser() user: AccessTokenPayload) {
 *   return this.userService.create(body, user)
 * }
 * ```
 */
export const RequireAdminRole = () => SetMetadata(REQUIRE_ADMIN_ROLE_KEY, true)
