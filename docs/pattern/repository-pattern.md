# Repository Pattern — Tài liệu trích xuất và mở rộng (chi tiết, đầy đủ)

---

> **Trích xuất ngắn từ ảnh**
> Repository Pattern là một mẫu thiết kế (design pattern) giúp tách biệt logic truy vấn dữ liệu khỏi logic nghiệp vụ của ứng dụng. Repository hoạt động như một **lớp trung gian** giữa ứng dụng và database, giúp quản lý và truy xuất dữ liệu một cách có tổ chức, dễ bảo trì hơn.
>
> **Cấu trúc cơ bản**:
>
> 1. **Entity (Model)** — đại diện cho bảng trong DB (ví dụ `User`, `Post`).
> 2. **Repository** — cài đặt logic truy vấn dữ liệu (dùng ORM như Prisma, TypeORM...).
> 3. **Service Layer** — gọi Repository để thực hiện thao tác với DB, không phụ thuộc trực tiếp vào ORM.
>
> Có thể chia nhỏ thêm thành `Repository Interface`, `Repository Implementation`, ... tuỳ quy mô và phong cách team.
>
> _“Đừng tìm cái tốt nhất, hãy tìm cái phù hợp nhất.”_

---

# 1. Định nghĩa & mục tiêu

**Repository Pattern** là một lớp/đối tượng trung gian, chịu trách nhiệm truy xuất và lưu trữ dữ liệu (CRUD, truy vấn phức tạp) cho các _entity/domain model_. Mục tiêu chính:

- **Tách biệt**: tách logic truy vấn (data access) khỏi logic nghiệp vụ (business logic).
- **Trừu tượng hóa**: che giấu chi tiết của nguồn dữ liệu (ORM, SQL, API, cache...) khỏi phần còn lại của ứng dụng.
- **Thay thế & test**: dễ mock/replace repository khi unit test, hoặc khi đổi DB/ORM.
- **Tổ chức**: gom các thao tác liên quan đến entity vào một nơi, dễ bảo trì và tái sử dụng.

# 2. Cấu trúc điển hình

Một hệ thống sử dụng Repository Pattern thường có các tầng:

- **Entity / Domain Model**: đối tượng biểu diễn dữ liệu (độc lập domain).
- **Repository Interface** (tùy chọn nhưng khuyến khích): mô tả các method cần có (ex: findById, save, delete).
- **Repository Implementation**: cài đặt interface bằng Prisma / TypeORM / SQL trực tiếp...
- **Service Layer (Business logic)**: sử dụng repository để thực hiện nghiệp vụ; không biết chi tiết DB.
- **Controller / API**: gọi service, trả response.

# 3. Các phương thức phổ biến trong repository

- `findById(id)`
- `findOne(filter)`
- `findAll({ skip, take, filter, order })` (hỗ trợ pagination)
- `create(data)` / `save(entity)`
- `update(id, data)`
- `delete(id)`
- `count(filter)`
- `exists(filter)`
- `upsert(...)`
- Các truy vấn chuyên biệt (ex: `findByEmail`, `searchByKeyword`)

# 4. Biến thể & patterns liên quan

- **Repository Interface + Implementation**: tách interface và cài đặt, hữu ích cho DI và test.
- **Generic Repository**: một repository chung cho nhiều entity (CRUD chung) — nhanh nhưng có thể thiếu tính chuyên biệt.
- **Query Object / Specification Pattern**: tách riêng điều kiện tìm kiếm phức tạp ra object để reuse.
- **DAO vs Repository**: DAO thường là lớp truy xuất thấp hơn, trực tiếp map tới bảng/ORM; Repository mang ý nghĩa domain hơn, trả về domain entities, có thể kết hợp nhiều DAO.
- **Unit of Work (UoW)**: quản lý transaction across multiple repositories.

# 5. Khi nào nên dùng / Khi nào không

- **Nên dùng**:
  - Ứng dụng có business logic không muốn phụ thuộc vào ORM.
  - Muốn test dễ dàng (mock repository).
  - Cần hỗ trợ nhiều nguồn dữ liệu (DB + cache + external API).
  - Dự án trung/bự, cần tổ chức, mở rộng.

- **Không cần thiết / có thể là overhead**:
  - Dự án nhỏ, CRUD đơn giản; dùng trực tiếp ORM repository có thể đủ.
  - Khi một lớp Repository chỉ là thin wrapper quanh ORM mà không thêm value.

# 6. Lợi ích & nhược điểm

**Lợi ích**

- Giảm coupling giữa business logic và data layer.
- Dễ mock khi test.
- Giúp thay đổi backend data source ít ảnh hưởng ứng dụng.
- Tổ chức code rõ ràng.

**Nhược điểm**

- Thêm lớp trung gian/boilerplate (đặc biệt với các repo generic).
- Nếu thiết kế kém, repository dễ trở thành nơi chứa mọi truy vấn (anemic / god repo).
- Chi phí phát triển & bảo trì cao hơn ở dự án nhỏ.

# 7. Best practices

- Thiết kế interface rõ ràng; trả về domain models (hoặc DTO), không trả trực tiếp query builder.
- Không đưa business logic vào repository — chỉ thao tác dữ liệu.
- Tách query phức tạp ra method riêng (ví dụ `findActiveWithOrders()`).
- Hỗ trợ pagination & sorting sớm.
- Sử dụng DI để dễ mock provider trong test.
- Map entity ORM → domain DTO nếu bạn muốn giữ domain clean.
- Khi cần transaction xuyên nhiều repo, dùng UoW hoặc transaction manager từ ORM.
- Log & handle errors ở repository cấp độ phù hợp (wrap ORM errors thành lỗi domain nếu cần).

# 8. Ví dụ minh họa (TypeScript + Prisma + NestJS)

**Domain type (đơn giản):**

```ts
// types/user.entity.ts
export type UserEntity = {
  id: number
  email: string
  name?: string | null
  createdAt: Date
}
```

**Repository interface (domain-level, không phụ thuộc Prisma types):**

```ts
// repositories/user.repository.ts
import { UserEntity } from '../types/user.entity'

export interface UserRepository {
  findById(id: number): Promise<UserEntity | null>
  findByEmail(email: string): Promise<UserEntity | null>
  findAll(opts?: { skip?: number; take?: number }): Promise<UserEntity[]>
  create(data: { email: string; name?: string }): Promise<UserEntity>
  update(id: number, data: Partial<{ email: string; name?: string }>): Promise<UserEntity>
  delete(id: number): Promise<void>
}
```

**Prisma implementation:**

```ts
// repositories/prisma-user.repository.ts
import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { UserRepository } from './user.repository'
import { UserEntity } from '../types/user.entity'

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaClient) {}

  private toEntity(u: any): UserEntity {
    if (!u) return null
    return {
      id: u.id,
      email: u.email,
      name: u.name,
      createdAt: u.createdAt,
    }
  }

  async findById(id: number) {
    const u = await this.prisma.user.findUnique({ where: { id } })
    return this.toEntity(u)
  }

  async findByEmail(email: string) {
    const u = await this.prisma.user.findUnique({ where: { email } })
    return this.toEntity(u)
  }

  async findAll(opts?: { skip?: number; take?: number }) {
    const users = await this.prisma.user.findMany({ skip: opts?.skip, take: opts?.take })
    return users.map(this.toEntity)
  }

  async create(data: { email: string; name?: string }) {
    const u = await this.prisma.user.create({ data })
    return this.toEntity(u)
  }

  async update(id: number, data: Partial<{ email: string; name?: string }>) {
    const u = await this.prisma.user.update({ where: { id }, data })
    return this.toEntity(u)
  }

  async delete(id: number) {
    await this.prisma.user.delete({ where: { id } })
  }
}
```

**Đăng ký provider trong Nest module (DI theo token):**

```ts
// user.module.ts
import { Module } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { PrismaUserRepository } from './repositories/prisma-user.repository'
import { UserService } from './user.service'

@Module({
  providers: [PrismaClient, { provide: 'UserRepository', useClass: PrismaUserRepository }, UserService],
  exports: ['UserRepository'],
})
export class UserModule {}
```

**Sử dụng trong Service:**

```ts
// user.service.ts
import { Inject, Injectable } from '@nestjs/common'
import { UserRepository } from './repositories/user.repository'

@Injectable()
export class UserService {
  constructor(@Inject('UserRepository') private userRepo: UserRepository) {}

  async getUserProfile(id: number) {
    return this.userRepo.findById(id)
  }
}
```

> Ghi chú: cách này tách interface (domain) khỏi implementation (Prisma). Khi muốn thay Prisma bằng TypeORM hay mock, chỉ cần thay provider.

# 9. Một số anti-pattern hay gặp

- Repository **lẫn business logic** (ví dụ: validation, thuật toán) — làm mất mục đích tách biệt.
- Trả về trực tiếp ORM-specific objects (QueryBuilder, PrismaClient instance results) gây leak coupling.
- Single "God Repository" chứa mọi query toàn app — khó maintain.
- Dùng generic repository quá rộng khiến không tận dụng được query đặc thù.

# 10. Kết luận ngắn gọn

Repository Pattern là một công cụ giúp giữ code sạch, dễ thay đổi và test, đặc biệt hữu ích cho ứng dụng có domain logic phức tạp hoặc cần khả năng thay đổi datastore/ORM. Tuy nhiên, với dự án nhỏ, việc thêm repository có thể gây overhead — quan trọng là **cân nhắc theo thực tế dự án** và thiết kế sao cho repository mang lại giá trị (không chỉ là boilerplate).

---
