import KeyvRedis from '@keyv/redis'
import { CacheModule } from '@nestjs/cache-manager'
import { Global, Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import Keyv from 'keyv'

import { EmailService } from 'src/shared/services/email.service'

import { AccessTokenGuard } from './guards/access-token.guard'
import { APIKeyGuard } from './guards/api-key.guard'
import { AuthenticationGuard } from './guards/authentication.guard'
import { AuthorizationGuard } from './guards/authorization.guard'
import { PermissionStrategy } from './guards/strategies/permission.strategy'
import { TwoFactorAuthService } from './services/2fa.service'
import { HashingService } from './services/hashing.service'
import { PrismaService } from './services/prisma.service'
import { Temp2FAService } from './services/temp-2fa.service'
import { TokenService } from './services/token.service'

const sharedServices = [
  PrismaService,
  HashingService,
  TokenService,
  AccessTokenGuard,
  APIKeyGuard,
  PermissionStrategy,
  EmailService,
  TwoFactorAuthService,
  Temp2FAService,
]

@Global()
@Module({
  providers: [
    ...sharedServices,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    },
  ],
  exports: sharedServices,
  imports: [
    JwtModule,
    CacheModule.register({
      store: new Keyv({
        store: new KeyvRedis('redis://localhost:6379/0'),
        ttl: 300000, // 5 minutes in milliseconds
      }),
    }),
  ],
})
export class SharedModule {}
