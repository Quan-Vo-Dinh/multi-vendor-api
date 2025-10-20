import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import type { EnvConfig } from './shared/config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  })

  // Sử dụng ConfigService thay vì process.env trực tiếp
  const configService = app.get<ConfigService<EnvConfig>>(ConfigService)
  const port = configService.get('PORT', { infer: true }) ?? 3000
  const appName = configService.get('APP_NAME', { infer: true })
  const nodeEnv = configService.get('NODE_ENV', { infer: true })

  await app.listen(port)

  console.log(`🚀 ${appName} is running on: http://localhost:${port}`)
  console.log(`📦 Environment: ${nodeEnv}`)
  console.log(`🎯 Process: ${process.pid}`)
}

bootstrap()
