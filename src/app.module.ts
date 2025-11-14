import * as path from 'path'

import KeyvRedis from '@keyv/redis'
import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n'
import { ZodSerializerInterceptor } from 'nestjs-zod'

import { validateEnv } from 'src/shared/config'
import { CatchEverythingFilter } from 'src/shared/filter/catch-everything.filter'
// import { HttpExceptionFilter } from 'src/shared/filter/http-exception.filter'
import { I18nExceptionFilter } from 'src/shared/filter/i18n-exception.filter'
import CustomZodValidationPipe from 'src/shared/pipes/custom-zod-validation.pipe'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './modules/auth/auth.module'
import { BrandModule } from './modules/brand/brand.module'
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
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.resolve('src/i18n'),
        watch: true,
      },
      typesOutputPath: path.resolve('src/generated/types/i18n.generated.ts'),
      resolvers: [{ use: QueryResolver, options: ['lang'] }, AcceptLanguageResolver, new HeaderResolver(['x-lang'])],
    }),
    SharedModule,
    AuthModule,
    BrandModule,
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
      provide: APP_FILTER,
      useClass: CatchEverythingFilter,
    },
    // Note: HttpExceptionFilter logs ZodSerializationException errors (keep for debugging)
    // Comment lại để không chặn I18nExceptionFilter (chỉ sử dụng khi cần debug)
    // {
    //   provide: APP_FILTER,
    //   useClass: HttpExceptionFilter,
    // },
    {
      provide: APP_FILTER,
      useClass: I18nExceptionFilter,
    },
  ],
})
export class AppModule {}
