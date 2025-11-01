import KeyvRedis from '@keyv/redis'
import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { ZodSerializerInterceptor } from 'nestjs-zod'

import { validateEnv } from 'src/shared/config'
import { CatchEverythingFilter } from 'src/shared/filter/catch-everything.filter'
import { HttpExceptionFilter } from 'src/shared/filter/http-exception.filter'
import CustomZodValidationPipe from 'src/shared/pipes/custom-zod-validation.pipe'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './modules/auth/auth.module'
import { LanguageModule } from './modules/language/language.module'
import { MediaModule } from './modules/media/media.module'
import { PermissionModule } from './modules/permission/permission.module'
import { ProfileModule } from './modules/profile/profile.module'
import { RoleModule } from './modules/role/role.module'
import { UserModule } from './modules/user/user.module'
import { SharedModule } from './shared/shared.module'

@Module({
  imports: [
    // ConfigModule phải được import đầu tiên để các module khác có thể sử dụng
    ConfigModule.forRoot({
      isGlobal: true, // Cho phép inject ConfigService ở bất kỳ đâu mà không cần import
      cache: true, // Cache environment variables để tăng performance
      envFilePath: [
        `.env.${process.env.NODE_ENV || 'development'}.local`,
        `.env.${process.env.NODE_ENV || 'development'}`,
        '.env.local',
        '.env',
      ],
      validate: validateEnv, // Validate với Zod schema
      expandVariables: true, // Cho phép sử dụng ${VAR} trong .env
    }),
    CacheModule.registerAsync({
      useFactory: () => {
        return {
          stores: [new KeyvRedis('redis://localhost:6379')],
        }
      },
    }),
    SharedModule,
    AuthModule,
    LanguageModule,
    MediaModule,
    PermissionModule,
    RoleModule,
    ProfileModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: CustomZodValidationPipe,
    },
    { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
    {
      provide: APP_FILTER, // show lỗi khi nó serialize bị lỗi
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: CatchEverythingFilter,
    },
  ],
})
export class AppModule {}
