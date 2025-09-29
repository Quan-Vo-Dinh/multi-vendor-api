# Account Management Routes

Base URL: `/accounts`

**Authentication:** Tất cả các endpoint yêu cầu Bearer Token

## GET /accounts

Lấy danh sách tất cả nhân viên trong hệ thống.

**Endpoint:** `GET /accounts`

**Authentication:** Bearer Token (chỉ Owner)

### Response

**Success (200):**

```json
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "Employee",
      "avatar": "https://example.com/avatar1.jpg"
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "Owner",
      "avatar": null
    }
  ],
  "message": "Lấy danh sách nhân viên thành công"
}
```

---

## POST /accounts

Tạo tài khoản nhân viên mới.

**Endpoint:** `POST /accounts`

**Authentication:** Bearer Token (chỉ Owner)

### Request Body

```json
{
  "name": "New Employee",
  "email": "employee@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Schema:**

- `name` (string, required): Tên nhân viên (2-256 ký tự)
- `email` (string, required): Email hợp lệ
- `password` (string, required): Mật khẩu (6-100 ký tự)
- `confirmPassword` (string, required): Xác nhận mật khẩu (phải trùng với password)
- `avatar` (string, optional): URL avatar hợp lệ

### Response

**Success (200):**

```json
{
  "data": {
    "id": 3,
    "name": "New Employee",
    "email": "employee@example.com",
    "role": "Employee",
    "avatar": "https://example.com/avatar.jpg"
  },
  "message": "Tạo tài khoản thành công"
}
```

---

## GET /accounts/me

Lấy thông tin tài khoản của user hiện tại.

**Endpoint:** `GET /accounts/me`

**Authentication:** Bearer Token

### Response

**Success (200):**

```json
{
  "data": {
    "id": 1,
    "name": "Current User",
    "email": "user@example.com",
    "role": "Employee",
    "avatar": "https://example.com/avatar.jpg"
  },
  "message": "Lấy thông tin thành công"
}
```

---

## PUT /accounts/me

Cập nhật thông tin cá nhân của user hiện tại.

**Endpoint:** `PUT /accounts/me`

**Authentication:** Bearer Token

### Request Body

```json
{
  "name": "Updated Name",
  "avatar": "https://example.com/new-avatar.jpg"
}
```

**Schema:**

- `name` (string, required): Tên mới (2-256 ký tự)
- `avatar` (string, optional): URL avatar mới

### Response

**Success (200):**

```json
{
  "data": {
    "id": 1,
    "name": "Updated Name",
    "email": "user@example.com",
    "role": "Employee",
    "avatar": "https://example.com/new-avatar.jpg"
  },
  "message": "Cập nhật thông tin thành công"
}
```

---

## GET /accounts/detail/:id

Lấy thông tin chi tiết của một nhân viên.

**Endpoint:** `GET /accounts/detail/{id}`

**Authentication:** Bearer Token (chỉ Owner)

### Path Parameters

- `id` (number): ID của nhân viên

### Response

**Success (200):**

```json
{
  "data": {
    "id": 2,
    "name": "Employee Name",
    "email": "employee@example.com",
    "role": "Employee",
    "avatar": "https://example.com/avatar.jpg"
  },
  "message": "Lấy thông tin nhân viên thành công"
}
```

---

## PUT /accounts/detail/:id

Cập nhật thông tin nhân viên.

**Endpoint:** `PUT /accounts/detail/{id}`

**Authentication:** Bearer Token (chỉ Owner)

### Path Parameters

- `id` (number): ID của nhân viên

### Request Body

```json
{
  "name": "Updated Employee",
  "email": "updated@example.com",
  "avatar": "https://example.com/avatar.jpg",
  "role": "Employee",
  "changePassword": true,
  "password": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

**Schema:**

- `name` (string, required): Tên nhân viên (2-256 ký tự)
- `email` (string, required): Email hợp lệ
- `avatar` (string, optional): URL avatar
- `role` (string, optional): Role ("Owner" hoặc "Employee", mặc định "Employee")
- `changePassword` (boolean, optional): Có đổi mật khẩu không
- `password` (string, optional): Mật khẩu mới (bắt buộc nếu changePassword = true)
- `confirmPassword` (string, optional): Xác nhận mật khẩu mới

### Response

**Success (200):**

```json
{
  "data": {
    "id": 2,
    "name": "Updated Employee",
    "email": "updated@example.com",
    "role": "Employee",
    "avatar": "https://example.com/avatar.jpg"
  },
  "message": "Cập nhật thành công"
}
```

**Note:** Nếu role được thay đổi, hệ thống sẽ gửi socket event "refresh-token" đến user đó.

---

## DELETE /accounts/detail/:id

Xóa tài khoản nhân viên.

**Endpoint:** `DELETE /accounts/detail/{id}`

**Authentication:** Bearer Token (chỉ Owner)

### Path Parameters

- `id` (number): ID của nhân viên

### Response

**Success (200):**

```json
{
  "data": {
    "id": 2,
    "name": "Deleted Employee",
    "email": "deleted@example.com",
    "role": "Employee",
    "avatar": "https://example.com/avatar.jpg"
  },
  "message": "Xóa thành công"
}
```

**Note:** Hệ thống sẽ gửi socket event "logout" đến user bị xóa.

---

## PUT /accounts/change-password

Đổi mật khẩu cho user hiện tại.

**Endpoint:** `PUT /accounts/change-password`

**Authentication:** Bearer Token

### Request Body

```json
{
  "oldPassword": "oldpassword123",
  "password": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

**Schema:**

- `oldPassword` (string, required): Mật khẩu cũ (6-100 ký tự)
- `password` (string, required): Mật khẩu mới (6-100 ký tự)
- `confirmPassword` (string, required): Xác nhận mật khẩu mới (phải trùng với password)

### Response

**Success (200):**

```json
{
  "data": {
    "id": 1,
    "name": "User Name",
    "email": "user@example.com",
    "role": "Employee",
    "avatar": "https://example.com/avatar.jpg"
  },
  "message": "Đổi mật khẩu thành công"
}
```

---

## PUT /accounts/change-password-v2

Đổi mật khẩu phiên bản 2 (có thể có logic khác).

**Endpoint:** `PUT /accounts/change-password-v2`

**Authentication:** Bearer Token

### Request Body

```json
{
  "oldPassword": "oldpassword123",
  "password": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

**Schema:** Tương tự như change-password

### Response

**Success (200):**

```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Đổi mật khẩu thành công"
}
```

---

## POST /accounts/guests

Tạo tài khoản khách hàng mới.

**Endpoint:** `POST /accounts/guests`

**Authentication:** Bearer Token (Owner hoặc Employee)

### Request Body

```json
{
  "name": "Guest Name",
  "tableNumber": 5
}
```

**Schema:**

- `name` (string, required): Tên khách hàng
- `tableNumber` (number, required): Số bàn

### Response

**Success (200):**

```json
{
  "message": "Tạo tài khoản khách thành công",
  "data": {
    "id": 1,
    "name": "Guest Name",
    "tableNumber": 5,
    "role": "Guest",
    "createdAt": "2025-09-28T10:00:00.000Z",
    "updatedAt": "2025-09-28T10:00:00.000Z"
  }
}
```

---

## GET /accounts/guests

Lấy danh sách khách hàng với bộ lọc theo ngày.

**Endpoint:** `GET /accounts/guests`

**Authentication:** Bearer Token (Owner hoặc Employee)

### Query Parameters

- `fromDate` (string, optional): Ngày bắt đầu (ISO 8601)
- `toDate` (string, optional): Ngày kết thúc (ISO 8601)

### Response

**Success (200):**

```json
{
  "message": "Lấy danh sách khách thành công",
  "data": [
    {
      "id": 1,
      "name": "Guest 1",
      "tableNumber": 5,
      "createdAt": "2025-09-28T10:00:00.000Z",
      "updatedAt": "2025-09-28T10:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Guest 2",
      "tableNumber": 3,
      "createdAt": "2025-09-28T11:00:00.000Z",
      "updatedAt": "2025-09-28T11:00:00.000Z"
    }
  ]
}
```

---

## Error Responses

**Common Error Codes:**

- `400`: Bad Request - Dữ liệu đầu vào không hợp lệ
- `401`: Unauthorized - Token không hợp lệ hoặc hết hạn
- `403`: Forbidden - Không có quyền truy cập
- `404`: Not Found - Tài khoản không tồn tại
- `409`: Conflict - Email đã tồn tại
- `422`: Validation Error - Lỗi validation dữ liệu
