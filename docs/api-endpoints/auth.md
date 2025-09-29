# Authentication Routes

Base URL: `/auth`

## POST /auth/login

Đăng nhập vào hệ thống với email và mật khẩu.

**Endpoint:** `POST /auth/login`

**Authentication:** Không yêu cầu

### Request Body

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Schema:**

- `email` (string, required): Email hợp lệ
- `password` (string, required): Mật khẩu (6-100 ký tự)

### Response

**Success (200):**

```json
{
  "message": "Đăng nhập thành công",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "account": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "Owner",
      "avatar": "https://example.com/avatar.jpg"
    }
  }
}
```

**Error Responses:**

- `400`: Email hoặc mật khẩu không hợp lệ
- `401`: Thông tin đăng nhập không chính xác

---

## POST /auth/logout

Đăng xuất khỏi hệ thống và vô hiệu hóa refresh token.

**Endpoint:** `POST /auth/logout`

**Authentication:** Bearer Token required

### Request Body

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Schema:**

- `refreshToken` (string, required): Refresh token cần vô hiệu hóa

### Response

**Success (200):**

```json
{
  "message": "Đăng xuất thành công"
}
```

**Error Responses:**

- `401`: Token không hợp lệ
- `422`: Refresh token không hợp lệ

---

## POST /auth/refresh-token

Làm mới access token bằng refresh token.

**Endpoint:** `POST /auth/refresh-token`

**Authentication:** Không yêu cầu

### Request Body

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Schema:**

- `refreshToken` (string, required): Refresh token hợp lệ

### Response

**Success (200):**

```json
{
  "message": "Lấy token mới thành công",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

- `401`: Refresh token không hợp lệ hoặc đã hết hạn
- `422`: Refresh token không đúng định dạng

---

## GET /auth/login/google

Đăng nhập bằng Google OAuth2. Endpoint này xử lý callback từ Google sau khi user xác thực.

**Endpoint:** `GET /auth/login/google`

**Authentication:** Không yêu cầu

### Query Parameters

- `code` (string, required): Authorization code từ Google

### Response

Endpoint này sẽ redirect về client URL với query parameters:

**Success:**

```
https://client-url.com/auth/callback?accessToken=<token>&refreshToken=<token>&status=200
```

**Error:**

```
https://client-url.com/auth/callback?message=<error_message>&status=<error_code>
```

**Error Responses:**

- `400`: Code không hợp lệ
- `500`: Lỗi server khi xử lý Google authentication

---

## Notes

### Token Expiration

- **Access Token**: 15 phút
- **Refresh Token**: 7 ngày

### Roles

- `Owner`: Chủ quán
- `Employee`: Nhân viên

### Security Headers

Tất cả các response đều bao gồm security headers thông qua Helmet middleware.
