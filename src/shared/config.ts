import fs from 'fs'
import path from 'path'

import { config } from 'dotenv'
import z from 'zod'

config()

if (!fs.existsSync(path.resolve('.env'))) {
  console.warn('.env file does not exist. Please create one based on .env.example')
  process.exit(1)
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
})

const configServer = configSchemaZod.safeParse(process.env)

if (!configServer.success) {
  console.error('Invalid environment variables:', configServer.error)
  process.exit(1)
}

const envConfig = configServer.data

export { envConfig }
