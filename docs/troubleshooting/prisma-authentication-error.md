# Prisma Authentication Error - P1000: Troubleshooting Guide

**Ngày gặp lỗi:** 20/10/2025  
**Lỗi code:** P1000 - Authentication failed against database server  
**Môi trường:** Production (PM2 + NestJS + Prisma + PostgreSQL)

---

## 1. Mô tả vấn đề

### 1.1. Triệu chứng

Khi chạy ứng dụng NestJS với PM2, ứng dụng khởi động routes thành công nhưng crash ngay sau đó với lỗi:

```
PrismaClientInitializationError: Authentication failed against database server,
the provided database credentials for `vodinhquan` are not valid.
```

### 1.2. Điều kỳ lạ khiến debug khó khăn

**🔴 Mâu thuẫn chính:**

- ✅ Kết nối `psql` thành công: `psql -U vodinhquan -h 127.0.0.1 -d multi_vendor`
- ✅ Prisma CLI thành công: `npx prisma migrate dev`
- ✅ Chạy trực tiếp với Node thành công: `node dist/src/main.js`
- ❌ Chạy qua PM2 thất bại: `pm2 start ecosystem.config.js`

**Điều này gây nhầm lẫn vì:**

- Database credentials chính xác (psql connect OK)
- Prisma schema đúng (Prisma CLI hoạt động)
- Code đúng (chạy trực tiếp OK)
- **Nhưng PM2 vẫn lỗi!**

---

## 2. Nguyên nhân gốc rễ (Root Cause Analysis)

### 2.1. Vấn đề chính: Environment Variables Loading Order

**Thứ tự thực thi sai:**

```
1. PM2 khởi động Node.js process
2. Node.js import modules → Prisma Client khởi tạo
3. Prisma đọc process.env.DATABASE_URL (UNDEFINED hoặc giá trị cũ)
4. PM2 load .env.production (QUÁ MUỘN!)
5. Prisma đã fail → App crash
```

**Vấn đề về PM2's `env_file` option:**

```javascript
// ecosystem.config.js (CẤU HÌNH SAI)
{
  env_file: '.env.production',  // ❌ Load sau khi process đã start!
}
```

PM2's `env_file` được load **AFTER** the Node.js process has started, nhưng Prisma Client khởi tạo **DURING** module import, nên DATABASE_URL chưa có.

### 2.2. Vấn đề phụ: PostgreSQL Authentication Method

PostgreSQL 16 mặc định dùng `scram-sha-256` cho TCP connections:

```conf
# pg_hba.conf
host    all    all    127.0.0.1/32    scram-sha-256
```

Nếu password được set không đúng cách hoặc Prisma sử dụng client cũ không hỗ trợ scram-sha-256, sẽ gặp lỗi authentication.

### 2.3. Vấn đề quyền Database

User `vodinhquan` không có quyền trên schema `public`:

```
Error: ERROR: permission denied for schema public
```

---

## 3. Giải pháp đã áp dụng (Current Solution)

### 3.1. Fix Environment Loading trong PM2

**File: `ecosystem.config.js`**

```javascript
// Load .env.production TRƯỚC KHI PM2 khởi động
require('dotenv').config({ path: '.env.production' })

module.exports = {
  apps: [
    {
      name: 'multi-vendor',
      cwd: '/home/quan/multi-vendor-api',
      script: './dist/src/main.js',
      watch: false,
      instances: 1,
      exec_mode: 'fork',
      // Pass tất cả env vars từ .env.production vào PM2
      env: {
        NODE_ENV: 'production',
        DATABASE_URL: process.env.DATABASE_URL,
        ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
        REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
        // ... tất cả các biến khác
      },
    },
  ],
}
```

### 3.2. Fix Environment Loading trong NestJS

**File: `src/main.ts`**

```typescript
import { NestFactory } from '@nestjs/core'
import { config } from 'dotenv'
import { resolve } from 'path'
import { AppModule } from './app.module'

// Load .env TRƯỚC KHI import bất kỳ module nào
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env'
config({ path: resolve(process.cwd(), envFile) })

// Debug logs (xóa sau khi production ổn định)
console.log('[DEBUG] NODE_ENV:', process.env.NODE_ENV)
console.log('[DEBUG] DATABASE_URL:', process.env.DATABASE_URL)

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
```

### 3.3. Fix PostgreSQL Permissions

```bash
sudo -u postgres psql -d multi_vendor -c "
  GRANT ALL ON SCHEMA public TO vodinhquan;
  GRANT ALL ON ALL TABLES IN SCHEMA public TO vodinhquan;
  GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO vodinhquan;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO vodinhquan;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO vodinhquan;
"
```

### 3.4. Fix PostgreSQL Authentication (optional)

Nếu vẫn gặp lỗi, đổi từ `scram-sha-256` sang `md5`:

```bash
sudo nano /etc/postgresql/16/main/pg_hba.conf
```

Đổi dòng:

```conf
# BEFORE
host    all    all    127.0.0.1/32    scram-sha-256

# AFTER
host    all    all    127.0.0.1/32    md5
```

Restart PostgreSQL:

```bash
sudo systemctl restart postgresql
```

Reset password:

```bash
sudo -u postgres psql -c "ALTER USER vodinhquan WITH PASSWORD 'quandeptrai';"
```

---

## 4. Giải pháp tương lai (Best Practices)

### 4.1. ✅ KHUYẾN NGHỊ: Sử dụng NestJS ConfigModule

**Lý do:**

- Type-safe environment variables
- Validation tự động
- Tích hợp sẵn với NestJS lifecycle
- Hỗ trợ .env loading đúng cách

**Cài đặt:**

```bash
npm install @nestjs/config class-validator class-transformer
```

**File: `src/config/env.validation.ts`**

```typescript
import { plainToInstance } from 'class-transformer'
import { IsString, IsNumber, IsEnum, validateSync } from 'class-validator'

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment

  @IsNumber()
  PORT: number

  @IsString()
  DATABASE_URL: string

  @IsString()
  ACCESS_TOKEN_SECRET: string

  @IsString()
  REFRESH_TOKEN_SECRET: string

  @IsString()
  SECRET_API_KEY: string

  @IsString()
  RESEND_API_KEY: string
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  })

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  })

  if (errors.length > 0) {
    throw new Error(errors.toString())
  }

  return validatedConfig
}
```

**File: `src/app.module.ts`**

```typescript
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { validate } from './config/env.validation'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
      validate,
      cache: true,
    }),
    // ... other modules
  ],
})
export class AppModule {}
```

**File: `src/main.ts` (CLEAN VERSION)**

```typescript
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Get config from ConfigModule instead of process.env
  const configService = app.get(ConfigService)
  const port = configService.get<number>('PORT', 3000)

  await app.listen(port)
  console.log(`🚀 Application running on: http://localhost:${port}`)
}
bootstrap()
```

### 4.2. ✅ Sử dụng PM2 Ecosystem File Đơn giản

```javascript
// ecosystem.config.js (CLEAN VERSION)
module.exports = {
  apps: [
    {
      name: 'multi-vendor',
      cwd: '/home/quan/multi-vendor-api',
      script: './dist/src/main.js',
      instances: 1,
      exec_mode: 'cluster', // Use cluster mode for better performance
      env_production: {
        NODE_ENV: 'production',
      },
      // NestJS ConfigModule sẽ tự động load .env.production
    },
  ],
}
```

Chạy với:

```bash
pm2 start ecosystem.config.js --env production
```

### 4.3. ✅ Sử dụng Docker với Multi-stage Build

**File: `Dockerfile`**

```dockerfile
# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

# Stage 2: Production
FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/src/main.js"]
```

**File: `docker-compose.yml`**

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://vodinhquan:quandeptrai@postgres:5432/multi_vendor?schema=public
      ACCESS_TOKEN_SECRET: ${ACCESS_TOKEN_SECRET}
      REFRESH_TOKEN_SECRET: ${REFRESH_TOKEN_SECRET}
      # ... other env vars
    depends_on:
      - postgres
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: vodinhquan
      POSTGRES_PASSWORD: quandeptrai
      POSTGRES_DB: multi_vendor
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

### 4.4. ✅ Sử dụng Secret Management

**Production-grade solution:**

```bash
# Sử dụng AWS Secrets Manager, Azure Key Vault, hoặc HashiCorp Vault
npm install @aws-sdk/client-secrets-manager
```

**File: `src/config/secrets.service.ts`**

```typescript
import { Injectable, OnModuleInit } from '@nestjs/common'
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager'

@Injectable()
export class SecretsService implements OnModuleInit {
  private client: SecretsManagerClient

  async onModuleInit() {
    if (process.env.NODE_ENV === 'production') {
      this.client = new SecretsManagerClient({ region: 'ap-southeast-1' })
      await this.loadSecrets()
    }
  }

  private async loadSecrets() {
    const secretName = 'multi-vendor-api/production'
    const command = new GetSecretValueCommand({ SecretId: secretName })
    const response = await this.client.send(command)

    const secrets = JSON.parse(response.SecretString)

    // Override process.env with secrets
    Object.assign(process.env, secrets)
  }
}
```

---

## 5. Checklist cho Production Deployment

### Pre-deployment:

- [ ] ✅ Tất cả environment variables trong `.env.production` được set đúng
- [ ] ✅ Database user có đủ quyền (GRANT ALL)
- [ ] ✅ PostgreSQL pg_hba.conf cho phép kết nối từ app
- [ ] ✅ Prisma migrations đã được apply: `npx prisma migrate deploy`
- [ ] ✅ Prisma Client đã được generate: `npx prisma generate`
- [ ] ✅ Build application: `npm run build`
- [ ] ✅ Test DATABASE_URL: `npx prisma db pull`

### Deployment:

```bash
# 1. Pull code
git pull origin main

# 2. Install dependencies
npm ci --only=production

# 3. Generate Prisma Client
npx prisma generate

# 4. Run migrations
npx prisma migrate deploy

# 5. Build
npm run build

# 6. Restart PM2
pm2 restart multi-vendor

# 7. Check logs
pm2 logs multi-vendor --lines 50

# 8. Monitor
pm2 monit
```

### Post-deployment:

- [ ] ✅ Check PM2 status: `pm2 status`
- [ ] ✅ Check logs for errors: `pm2 logs multi-vendor`
- [ ] ✅ Test API endpoints: `curl http://localhost:3000/health`
- [ ] ✅ Monitor database connections: `sudo -u postgres psql -c "SELECT * FROM pg_stat_activity WHERE datname='multi_vendor'"`

---

## 6. Debugging Commands

### Test Database Connection:

```bash
# Test với psql
PGPASSWORD=quandeptrai psql -U vodinhquan -h 127.0.0.1 -d multi_vendor -c "SELECT 1;"

# Test với Prisma CLI
DATABASE_URL="postgresql://vodinhquan:quandeptrai@127.0.0.1:5432/multi_vendor?schema=public" \
  npx prisma db pull
```

### Test Environment Loading:

```bash
# Test dotenv loading
node -e "require('dotenv').config({path: '.env.production'}); console.log('DATABASE_URL:', process.env.DATABASE_URL)"

# Test PM2 env
pm2 env 0 | grep DATABASE_URL
```

### Test App:

```bash
# Test trực tiếp với Node (bypass PM2)
NODE_ENV=production node dist/src/main.js

# Test với PM2
pm2 start ecosystem.config.js --env production
pm2 logs multi-vendor --lines 100
```

### Check PostgreSQL:

```bash
# Check authentication method
sudo cat /etc/postgresql/16/main/pg_hba.conf | grep -v "^#" | grep -v "^$"

# Check user permissions
sudo -u postgres psql -d multi_vendor -c "\du vodinhquan"
sudo -u postgres psql -d multi_vendor -c "\dp"

# Check active connections
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity WHERE datname='multi_vendor';"
```

---

## 7. Lessons Learned

### 🎯 Key Takeaways:

1. **PM2's `env_file` không đáng tin cậy cho Prisma**  
   → Sử dụng `dotenv` trong code hoặc pass env vars trực tiếp

2. **Environment loading phải xảy ra TRƯỚC module imports**  
   → Load dotenv ở đầu file `main.ts`

3. **Validation environment variables là bắt buộc**  
   → Sử dụng NestJS ConfigModule + class-validator

4. **Không nên hardcode secrets trong code**  
   → Sử dụng secret management services

5. **Database permissions phải được setup đúng cách**  
   → GRANT đầy đủ quyền cho app user

6. **PostgreSQL authentication methods quan trọng**  
   → Đảm bảo client hỗ trợ auth method của server

7. **Testing phải được thực hiện ở nhiều layers**
   - ✅ Database: `psql` connection test
   - ✅ ORM: `prisma` CLI test
   - ✅ App: Direct `node` run test
   - ✅ Process Manager: `pm2` test

---

## 8. Related Issues & References

### Prisma Issues:

- [Prisma Issue #12345](https://github.com/prisma/prisma/issues): P1000 Authentication Error
- [Prisma Docs: Connection Management](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/connection-management)

### NestJS Config:

- [NestJS Docs: Configuration](https://docs.nestjs.com/techniques/configuration)
- [NestJS Docs: Validation](https://docs.nestjs.com/techniques/validation)

### PM2:

- [PM2 Docs: Environment Variables](https://pm2.keymetrics.io/docs/usage/environment/)
- [PM2 Docs: Ecosystem File](https://pm2.keymetrics.io/docs/usage/application-declaration/)

### PostgreSQL:

- [PostgreSQL Docs: Authentication Methods](https://www.postgresql.org/docs/current/auth-methods.html)
- [PostgreSQL Docs: GRANT](https://www.postgresql.org/docs/current/sql-grant.html)

---

**Tác giả:** Võ Đình Quân  
**Ngày tạo:** 20/10/2025  
**Cập nhật lần cuối:** 20/10/2025
