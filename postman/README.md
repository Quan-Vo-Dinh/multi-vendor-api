# Multi-Vendor Complete API - Postman Collection

Đây là Postman Collection hoàn chỉnh cho toàn bộ Multi-Vendor API, bao gồm tất cả các modules và flows.

## 📋 Tổng quan

Collection này bao gồm **80+ endpoints** được tổ chức theo 9 modules chính:

### 🔐 1. Authentication Flow (6 endpoints)

- Register (với OTP verification)
- Send OTP
- Login (hỗ trợ 2FA)
- Refresh Token
- Logout
- Forgot Password

### 🔒 2. Two-Factor Authentication (4 endpoints)

- Setup 2FA (generate QR code)
- Activate 2FA
- Verify 2FA (complete login)
- Disable 2FA

### 👤 3. Profile Management (3 endpoints)

- Get My Profile
- Update My Profile
- Change Password

### 👥 4. User Management (5 endpoints)

- CRUD operations cho User (admin only)
- Pagination support

### 🎭 5. Role Management (5 endpoints)

- CRUD operations cho Role
- Assign permissions to roles

### 🔑 6. Permission Management (5 endpoints)

- CRUD operations cho Permission
- Resource-based access control

### 🏷️ 7. Brand Management (9 endpoints)

- CRUD operations cho Brand
- CRUD operations cho Brand Translation
- Multi-language support

### 🌐 8. Language Management (5 endpoints)

- CRUD operations cho Language
- Manage available languages

### 📁 9. Media Management (3 endpoints)

- Upload images (multi-file)
- Get presigned URL for S3
- Test S3 connection

### 🧪 10. Testing Scenarios (3 pre-configured flows)

- Complete New User Journey
- i18n Error Message Testing
- Brand with Translations Flow

## 🚀 Setup Instructions

### 1. Import Collection vào Postman

**Option A: Import từ file**

```
File → Import → Chọn Multi-Vendor-Complete-API.postman_collection.json
```

**Option B: Import từ URL (nếu host trên GitHub)**

```
File → Import → Link → Paste URL
```

### 2. Cấu hình Collection Variables

Sau khi import, click vào collection → Variables tab và cấu hình:

| Variable             | Initial Value           | Description                                |
| -------------------- | ----------------------- | ------------------------------------------ |
| `baseUrl`            | `http://localhost:3000` | API base URL                               |
| `accessToken`        | _(auto-filled)_         | JWT access token (auto-saved after login)  |
| `refreshToken`       | _(auto-filled)_         | JWT refresh token (auto-saved after login) |
| `userId`             | _(auto-filled)_         | Current user ID (auto-saved)               |
| `roleId`             | _(auto-filled)_         | Current role ID (auto-saved)               |
| `permissionId`       | _(auto-filled)_         | Current permission ID (auto-saved)         |
| `brandId`            | _(auto-filled)_         | Current brand ID (auto-saved)              |
| `brandTranslationId` | _(auto-filled)_         | Current translation ID (auto-saved)        |
| `languageId`         | `en`                    | Current language ID                        |
| `language`           | `en`                    | Accept-Language header value               |
| `testEmail`          | `test@example.com`      | Email for testing                          |
| `testPassword`       | `Test123456@`           | Password for testing                       |
| `twoFactorToken`     | _(auto-filled)_         | 2FA token (auto-saved)                     |

### 3. Thay đổi Environment (Optional)

Nếu muốn test trên nhiều môi trường khác nhau:

```
Environments → Create New → Thêm variables:
- baseUrl: https://api-staging.example.com
- baseUrl: https://api-production.example.com
```

## 🎯 Quick Start Guide

### Bước 1: Authentication Flow

1. **Send OTP**: Gửi OTP đến email

```json
POST /auth/otp
Body: { "email": "test@example.com" }
```

2. **Register**: Đăng ký tài khoản mới

```json
POST /auth/register
Body: {
  "email": "test@example.com",
  "password": "Test123456@",
  "name": "Test User",
  "otp": "123456"
}
```

3. **Login**: Đăng nhập (tokens sẽ tự động lưu)

```json
POST /auth/login
Body: {
  "email": "test@example.com",
  "password": "Test123456@"
}
```

✅ Sau khi login thành công, `accessToken` và `refreshToken` sẽ **tự động được lưu** vào collection variables.

### Bước 2: Test Protected Endpoints

Tất cả requests sau login sẽ tự động sử dụng `{{accessToken}}` trong Authorization header.

**Ví dụ: Get My Profile**

```
GET /profile
Authorization: Bearer {{accessToken}}
```

### Bước 3: Test i18n (Multi-language)

Để test error messages bằng tiếng Việt:

1. Đổi collection variable `language` từ `en` → `vi`
2. Hoặc thêm header: `Accept-Language: vi`
3. Hoặc thêm query param: `?lang=vi`

**Ví dụ:**

```
GET /users/99999
Accept-Language: vi

Response:
{
  "message": "Không tìm thấy người dùng"
}
```

## 🔧 Advanced Features

### 1. Auto-save Variables

Collection sử dụng **Test Scripts** để tự động lưu IDs sau khi tạo resources:

- Login → Save `accessToken`, `refreshToken`
- Create User → Save `userId`
- Create Role → Save `roleId`
- Create Brand → Save `brandId`
- Etc.

**Example Test Script:**

```javascript
if (pm.response.code === 201) {
  const response = pm.response.json()
  pm.collectionVariables.set('brandId', response.data.id)
  console.log('Brand ID saved:', response.data.id)
}
```

### 2. Global Pre-request Script

Tất cả requests đều chạy global pre-request script để log thông tin:

```javascript
console.log('Request to:', pm.request.url.toString())
console.log('Language:', pm.collectionVariables.get('language'))
```

### 3. Global Test Script

Tất cả responses đều chạy global test script:

```javascript
console.log('Response status:', pm.response.code)
console.log('Response time:', pm.response.responseTime + 'ms')
```

## 🧪 Pre-configured Testing Scenarios

### Scenario 1: Complete New User Journey

Chạy **Collection Runner** với folder này để test toàn bộ flow:

1. Send OTP
2. Register
3. Login (tokens auto-saved)
4. Get My Profile
5. Update Profile

### Scenario 2: i18n Error Message Testing

Test error messages với cả English và Vietnamese:

- User Not Found (English)
- User Not Found (Vietnamese)
- Brand Not Found (English)
- Brand Not Found (Vietnamese)

### Scenario 3: Brand with Translations Flow

Test brand creation với multi-language translations:

1. Create Brand
2. Add English Translation
3. Add Vietnamese Translation
4. Get Brand with All Translations

## 🌍 i18n Testing Guide

### 3 cách để chỉ định ngôn ngữ:

#### 1. Query Parameter (Priority 1)

```
GET /brands?lang=vi
```

#### 2. Accept-Language Header (Priority 2)

```
Accept-Language: vi
```

#### 3. x-lang Header (Priority 3)

```
x-lang: vi
```

### Supported Languages

- `en` - English (fallback default)
- `vi` - Vietnamese (Tiếng Việt)

### Testing Error Messages

**English:**

```
GET /users/99999
Accept-Language: en

Response:
[
  {
    "message": "User not found",
    "path": "userId"
  }
]
```

**Vietnamese:**

```
GET /users/99999
Accept-Language: vi

Response:
[
  {
    "message": "Không tìm thấy người dùng",
    "path": "userId"
  }
]
```

### Testing Success Messages

**English:**

```
DELETE /brands/1
Accept-Language: en

Response:
{
  "message": "Brand deleted successfully"
}
```

**Vietnamese:**

```
DELETE /brands/1
Accept-Language: vi

Response:
{
  "message": "Xóa thương hiệu thành công"
}
```

## 📊 Collection Structure

```
Multi-Vendor Complete API/
├── 🔐 Authentication Flow/
│   ├── 1. Register New User
│   ├── 2. Send OTP
│   ├── 3. Login
│   ├── 4. Refresh Token
│   ├── 5. Logout
│   └── 6. Forgot Password
│
├── 🔒 Two-Factor Authentication/
│   ├── 1. Setup 2FA
│   ├── 2. Activate 2FA
│   ├── 3. Verify 2FA (Login)
│   └── 4. Disable 2FA
│
├── 👤 Profile Management/
│   ├── Get My Profile
│   ├── Update My Profile
│   └── Change Password
│
├── 👥 User Management/
│   ├── Get All Users
│   ├── Get User by ID
│   ├── Create User
│   ├── Update User
│   └── Delete User
│
├── 🎭 Role Management/
│   ├── Get All Roles
│   ├── Get Role by ID
│   ├── Create Role
│   ├── Update Role
│   └── Delete Role
│
├── 🔑 Permission Management/
│   ├── Get All Permissions
│   ├── Get Permission by ID
│   ├── Create Permission
│   ├── Update Permission
│   └── Delete Permission
│
├── 🏷️ Brand Management/
│   ├── Get All Brands
│   ├── Get Brand by ID
│   ├── Create Brand
│   ├── Update Brand
│   ├── Delete Brand
│   ├── Create Brand Translation
│   ├── Get Brand Translation by ID
│   ├── Update Brand Translation
│   └── Delete Brand Translation
│
├── 🌐 Language Management/
│   ├── Get All Languages
│   ├── Get Language by ID
│   ├── Create Language
│   ├── Update Language
│   └── Delete Language
│
├── 📁 Media Management/
│   ├── Upload Images
│   ├── Get Presigned URL
│   └── Test S3 Connection
│
└── 🧪 Testing Scenarios/
    ├── Complete Flow - New User Journey/
    ├── i18n Testing - Error Messages/
    └── Brand with Translations Flow/
```

## 🔐 Authentication

### Bearer Token Authentication

Collection sử dụng **Collection-level Bearer Token Authentication**:

```
Authorization: Bearer {{accessToken}}
```

### Public Endpoints (No Auth Required)

Các endpoints sau không cần authentication:

- `POST /auth/register`
- `POST /auth/otp`
- `POST /auth/login`
- `POST /auth/refresh-token`
- `POST /auth/forgot-password`
- `POST /auth/2fa/verify`
- `POST /media/presigned-url`
- `GET /media/s3-test/list-buckets`

Các endpoints này có `auth: { type: "noauth" }` trong request config.

### Skip Authorization Endpoints

Các endpoints này cần token nhưng skip authorization check:

- `POST /auth/logout`
- `POST /auth/2fa/setup`
- `POST /auth/2fa/activate`
- `POST /auth/2fa/disable`

## 📝 Tips & Best Practices

### 1. Use Collection Runner

Để chạy nhiều requests liên tiếp:

```
Collection → ... → Run collection
Chọn folder hoặc toàn bộ collection
Click "Run Multi-Vendor Complete API"
```

### 2. Environment Variables vs Collection Variables

- **Collection Variables**: Dùng cho data cụ thể của collection này (brandId, userId, etc.)
- **Environment Variables**: Dùng cho config theo môi trường (baseUrl dev/staging/prod)

### 3. Check Console Logs

Mở Postman Console để xem:

- Request details
- Auto-saved variables
- Response times
- Error messages

```
View → Show Postman Console
```

### 4. Export Test Results

Sau khi chạy Collection Runner:

```
Export Results → JSON/CSV
```

### 5. Share Collection

**Export & Share:**

```
Collection → ... → Export → Collection v2.1 (recommended)
```

**Publish to Workspace:**

```
Collection → ... → Share → Invite to workspace
```

## 🐛 Troubleshooting

### Issue: "Unauthorized" error

**Solution:**

1. Check `accessToken` có giá trị trong Variables tab
2. Chạy lại Login request
3. Kiểm tra token có expired chưa (thử Refresh Token)

### Issue: Variables không tự động save

**Solution:**

1. Kiểm tra Test Scripts có được enable
2. Check response có trả về đúng format không
3. Mở Console để xem error logs

### Issue: i18n không work

**Solution:**

1. Kiểm tra `Accept-Language` header có đúng giá trị (`en` hoặc `vi`)
2. Thử dùng query param `?lang=vi` thay vì header
3. Verify backend có bật i18n middleware chưa

### Issue: Upload images failed

**Solution:**

1. Kiểm tra file size < 5MB
2. Verify file type là image (jpg, jpeg, png, gif, webp)
3. Check S3 credentials trong backend `.env`

## 📚 Related Documentation

- [API Documentation](../docs/api-endpoints/README.md)
- [i18n Implementation Guide](../docs/i18n-implementation.md)
- [i18n Testing Guide](../docs/i18n-testing-guide.md)
- [2FA Implementation](../docs/2fa-implementation.md)

## 🔄 Version History

### v2.0.0 (Current)

- ✅ Complete API coverage (80+ endpoints)
- ✅ Full authentication flow with 2FA
- ✅ i18n support (English & Vietnamese)
- ✅ Auto-save variables
- ✅ Pre-configured test scenarios
- ✅ Global scripts for logging
- ✅ Comprehensive documentation

### v1.0.0 (Previous)

- ✅ Brand API only (9 endpoints)
- ✅ Basic i18n support

## 📞 Support

Nếu gặp vấn đề, liên hệ:

- GitHub Issues: [Create new issue](https://github.com/Quan-Vo-Dinh/multi-vendor-api/issues)
- Email: support@example.com

---

**Happy Testing! 🚀**
