# Config Migration Guide: From envConfig to ConfigService

## Tổng quan

Dự án đã migrate từ cách sử dụng `envConfig` object trực tiếp sang sử dụng **NestJS ConfigService** với validation bằng **Zod**.

## Thay đổi chính

### ❌ Cách cũ (DEPRECATED)

```typescript
import { envConfig } from 'src/shared/config'

// Sử dụng trực tiếp
const port = envConfig.PORT
const dbUrl = envConfig.DATABASE_URL
```

### ✅ Cách mới (RECOMMENDED)

```typescript
import { ConfigService } from '@nestjs/config'
import { Injectable } from '@nestjs/common'
import type { EnvConfig } from 'src/shared/config'

@Injectable()
export class YourService {
  constructor(private configService: ConfigService<EnvConfig>) {}

  someMethod() {
    // Type-safe access with auto-completion
    const port = this.configService.get('PORT', { infer: true })
    const dbUrl = this.configService.get('DATABASE_URL', { infer: true })

    // With default value
    const timeout = this.configService.get('TIMEOUT', { infer: true }) ?? 5000
  }
}
```

## Migration checklist cho từng file

### 1. Services

**Before:**

```typescript
import { envConfig } from 'src/shared/config'

export class TokenService {
  private accessTokenSecret = envConfig.ACCESS_TOKEN_SECRET
  private refreshTokenSecret = envConfig.REFRESH_TOKEN_SECRET
}
```

**After:**

```typescript
import { ConfigService } from '@nestjs/config'
import { Injectable } from '@nestjs/common'
import type { EnvConfig } from 'src/shared/config'

@Injectable()
export class TokenService {
  private accessTokenSecret: string
  private refreshTokenSecret: string

  constructor(private configService: ConfigService<EnvConfig>) {
    this.accessTokenSecret = this.configService.get('ACCESS_TOKEN_SECRET', { infer: true })!
    this.refreshTokenSecret = this.configService.get('REFRESH_TOKEN_SECRET', { infer: true })!
  }
}
```

### 2. Modules với Dynamic Configuration

**Before:**

```typescript
import { envConfig } from 'src/shared/config'

@Module({
  imports: [
    JwtModule.register({
      secret: envConfig.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: envConfig.ACCESS_TOKEN_EXPIRATION },
    }),
  ],
})
export class AuthModule {}
```

**After:**

```typescript
import { ConfigService } from '@nestjs/config'
import type { EnvConfig } from 'src/shared/config'

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvConfig>) => ({
        secret: config.get('ACCESS_TOKEN_SECRET', { infer: true }),
        signOptions: {
          expiresIn: config.get('ACCESS_TOKEN_EXPIRATION', { infer: true }),
        },
      }),
    }),
  ],
})
export class AuthModule {}
```

### 3. Guards và Interceptors

**Before:**

```typescript
import { envConfig } from 'src/shared/config'

export class APIKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const apiKey = request.headers['x-api-key']
    return apiKey === envConfig.SECRET_API_KEY
  }
}
```

**After:**

```typescript
import { ConfigService } from '@nestjs/config'
import { Injectable } from '@nestjs/common'
import type { EnvConfig } from 'src/shared/config'

@Injectable()
export class APIKeyGuard implements CanActivate {
  constructor(private configService: ConfigService<EnvConfig>) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const apiKey = request.headers['x-api-key']
    const validApiKey = this.configService.get('SECRET_API_KEY', { infer: true })
    return apiKey === validApiKey
  }
}
```

## Lợi ích của cách mới

### 1. Type Safety

```typescript
// ✅ TypeScript biết chính xác type của mỗi config
const port: number = this.configService.get('PORT', { infer: true })
const email: string = this.configService.get('ADMIN_EMAIL', { infer: true })

// ❌ Lỗi compile-time nếu key không tồn tại
const invalid = this.configService.get('NON_EXISTENT_KEY', { infer: true }) // Error!
```

### 2. Auto-completion trong IDE

- IntelliSense/Auto-complete hoạt động 100%
- Không cần nhớ tên biến môi trường
- Refactor dễ dàng

### 3. Testability

```typescript
describe('TokenService', () => {
  let service: TokenService
  let mockConfigService: ConfigService

  beforeEach(async () => {
    mockConfigService = {
      get: jest.fn((key) => {
        const config = {
          ACCESS_TOKEN_SECRET: 'test-secret',
          ACCESS_TOKEN_EXPIRATION: '15m',
        }
        return config[key]
      }),
    } as any

    const module = await Test.createTestingModule({
      providers: [TokenService, { provide: ConfigService, useValue: mockConfigService }],
    }).compile()

    service = module.get<TokenService>(TokenService)
  })

  it('should generate token', () => {
    // Test với mock config
    expect(service.generateToken({})).toBeDefined()
  })
})
```

### 4. Runtime Validation

```typescript
// Zod validation tự động khi app khởi động
// ❌ App sẽ crash ngay với error message rõ ràng nếu:
// - Thiếu biến môi trường bắt buộc
// - Format không đúng (email, URL, số...)
// - Giá trị nằm ngoài range cho phép
```

### 5. Environment-specific Loading

```typescript
// ConfigModule tự động load đúng file:
// - .env.production khi NODE_ENV=production
// - .env.development khi NODE_ENV=development
// - .env.local (override local development)
// - .env (fallback)
```

## Files cần migrate

Tìm tất cả usage của `envConfig`:

```bash
# Search trong codebase
grep -r "envConfig" src/

# Hoặc với ripgrep (nhanh hơn)
rg "envConfig" src/
```

### Danh sách files phổ biến cần check:

- [ ] `src/modules/auth/auth.service.ts`
- [ ] `src/modules/auth/auth.module.ts`
- [ ] `src/shared/services/token.service.ts`
- [ ] `src/shared/services/hashing.service.ts`
- [ ] `src/shared/services/email.service.ts`
- [ ] `src/shared/guards/api-key.guard.ts`
- [ ] `src/shared/guards/access-token.guard.ts`

## Breaking Changes

### ⚠️ envConfig export vẫn còn nhưng DEPRECATED

```typescript
// File: src/shared/config.ts
/**
 * DEPRECATED: Legacy export cho backward compatibility
 * Sẽ được xóa trong version tương lai
 * @deprecated Use ConfigService from @nestjs/config instead
 */
export const envConfig = validateEnv(process.env)
```

**Lý do giữ lại tạm thời:**

- Để code cũ không bị break ngay lập tức
- Cho phép migrate từng file một
- Sẽ xóa hoàn toàn trong bản release tiếp theo

**Timeline:**

- ✅ v1.0.0: Thêm ConfigModule (hiện tại)
- 🚧 v1.1.0: Migrate tất cả files sang ConfigService
- ❌ v2.0.0: Xóa hoàn toàn envConfig export

## Testing sau migration

### 1. Test app khởi động

```bash
npm run build
NODE_ENV=production node dist/src/main.js
```

### 2. Test với PM2

```bash
pm2 delete multi-vendor
pm2 start ecosystem.config.js --env production
pm2 logs multi-vendor
```

### 3. Test validation

```bash
# Test missing required var
unset DATABASE_URL
npm run start:dev  # Sẽ crash với error message rõ ràng

# Test invalid format
export ADMIN_EMAIL="not-an-email"
npm run start:dev  # Sẽ crash với validation error
```

### 4. Test type safety

```typescript
// Trong IDE, test auto-completion
const config = this.configService.get('') // Ctrl+Space → see all options
```

## Troubleshooting

### Lỗi: "Cannot read property 'get' of undefined"

**Nguyên nhân:** Quên inject ConfigService

**Giải pháp:**

```typescript
constructor(private configService: ConfigService<EnvConfig>) {}
```

### Lỗi: "Configuration key 'XXX' does not exist"

**Nguyên nhân:** Key không có trong Zod schema

**Giải pháp:** Thêm vào `envSchema` trong `src/shared/config.ts`:

```typescript
export const envSchema = z.object({
  // ... existing keys
  XXX: z.string().min(1),
})
```

### Lỗi: "Property 'XXX' does not exist on type 'EnvConfig'"

**Nguyên nhân:** TypeScript không infer được type

**Giải pháp:** Sử dụng `{ infer: true }`:

```typescript
const value = this.configService.get('XXX', { infer: true })
```

## Resources

- [NestJS Configuration Docs](https://docs.nestjs.com/techniques/configuration)
- [Zod Documentation](https://zod.dev/)
- [NestJS Zod Integration](https://github.com/risenforces/nestjs-zod)

---

**Last Updated:** 2025-10-20
