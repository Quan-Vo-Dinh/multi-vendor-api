import fs from 'fs'
import path from 'path'

import { config as dotenvConfig } from 'dotenv'
import z from 'zod'

// try load .env.local, .env.<NODE_ENV>, then .env (first found)
const envCandidates = [
  path.resolve('.env.local'),
  path.resolve(`.env.${process.env.NODE_ENV || 'development'}`),
  path.resolve('.env'),
]

let loadedFile: string | null = null
for (const p of envCandidates) {
  if (fs.existsSync(p)) {
    dotenvConfig({ path: p })
    loadedFile = p
    break
  }
}

// Optional: warn if none loaded but environment variables exist
if (!loadedFile) {
  console.warn('No .env file loaded (checked .env.local, .env.$NODE_ENV, .env). Relying on process.env.')
} else {
  console.info(`Loaded environment file: ${loadedFile}`)
}

const configSchemaZod = z.object({
  DATABASE_URL: z.string().min(1, { message: 'DATABASE_URL is required' }),
  ACCESS_TOKEN_SECRET: z.string().min(1, { message: 'ACCESS_TOKEN_SECRET is required' }),
  REFRESH_TOKEN_SECRET: z.string().min(1, { message: 'REFRESH_TOKEN_SECRET is required' }),
  REFRESH_TOKEN_EXPIRATION: z.string().min(1, { message: 'REFRESH_TOKEN_EXPIRATION is required' }),
  ACCESS_TOKEN_EXPIRATION: z.string().min(1, { message: 'ACCESS_TOKEN_EXPIRATION is required' }),
  SECRET_API_KEY: z.string().min(1, { message: 'SECRET_API_KEY is required' }),
  SALT_ROUNDS: z.string().min(1, { message: 'SALT_ROUNDS is required' }),
  PORT: z.string().min(1, { message: 'PORT is required' }),
  ADMIN_NAME: z.string().min(1, { message: 'ADMIN_NAME is required' }),
  ADMIN_EMAIL: z.string().min(1, { message: 'ADMIN_EMAIL is required' }),
  ADMIN_PASSWORD: z.string().min(1, { message: 'ADMIN_PASSWORD is required' }),
  ADMIN_PHONE_NUMBER: z.string().min(1, { message: 'ADMIN_PHONE_NUMBER is required' }),
  OTP_EXPIRATION_MINUTES: z.string().min(1, { message: 'OTP_EXPIRATION_MINUTES is required' }),
  RESEND_API_KEY: z.string().min(1, { message: 'RESEND_API_KEY is required' }),
  APP_NAME: z.string().min(1, { message: 'APP_NAME is required' }),
})

const configServer = configSchemaZod.safeParse(process.env)

// console.log('Environment variables:', process)

if (!configServer.success) {
  console.error('Invalid environment variables:', configServer.error)
  process.exit(1)
}

const envConfig = configServer.data

export { envConfig }
