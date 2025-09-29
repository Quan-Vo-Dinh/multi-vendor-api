# Table Management Routes

Base URL: `/tables`

## GET /tables

Lấy danh sách tất cả bàn trong nhà hàng.

**Endpoint:** `GET /tables`

**Authentication:** Không yêu cầu

### Response

**Success (200):**

```json
{
  "data": [
    {
      "number": 1,
      "capacity": 4,
      "status": "Available",
      "token": "abc123def456",
      "createdAt": "2025-09-28T10:00:00.000Z",
      "updatedAt": "2025-09-28T10:00:00.000Z"
    },
    {
      "number": 2,
      "capacity": 6,
      "status": "Occupied",
      "token": "xyz789uvw012",
      "createdAt": "2025-09-28T10:00:00.000Z",
      "updatedAt": "2025-09-28T11:30:00.000Z"
    }
  ],
  "message": "Lấy danh sách bàn thành công!"
}
```

---

## GET /tables/:number

Lấy thông tin chi tiết của một bàn.

**Endpoint:** `GET /tables/{number}`

**Authentication:** Không yêu cầu

### Path Parameters

- `number` (number): Số bàn

### Response

**Success (200):**

```json
{
  "data": {
    "number": 1,
    "capacity": 4,
    "status": "Available",
    "token": "abc123def456",
    "createdAt": "2025-09-28T10:00:00.000Z",
    "updatedAt": "2025-09-28T10:00:00.000Z"
  },
  "message": "Lấy thông tin bàn thành công!"
}
```

**Error Responses:**

- `404`: Bàn không tồn tại

---

## POST /tables

Tạo bàn mới trong nhà hàng.

**Endpoint:** `POST /tables`

**Authentication:** Bearer Token (Owner hoặc Employee)

### Request Body

```json
{
  "number": 10,
  "capacity": 8,
  "status": "Available"
}
```

**Schema:**

- `number` (number, required): Số bàn (phải duy nhất)
- `capacity` (number, required): Sức chứa (số người ngồi)
- `status` (string, required): Trạng thái ("Available", "Occupied", "Reserved", "Hidden")

### Response

**Success (200):**

```json
{
  "data": {
    "number": 10,
    "capacity": 8,
    "status": "Available",
    "token": "generated-unique-token",
    "createdAt": "2025-09-28T12:00:00.000Z",
    "updatedAt": "2025-09-28T12:00:00.000Z"
  },
  "message": "Tạo bàn thành công!"
}
```

**Error Responses:**

- `409`: Số bàn đã tồn tại

---

## PUT /tables/:number

Cập nhật thông tin bàn.

**Endpoint:** `PUT /tables/{number}`

**Authentication:** Bearer Token (Owner hoặc Employee)

### Path Parameters

- `number` (number): Số bàn cần cập nhật

### Request Body

```json
{
  "capacity": 6,
  "status": "Reserved",
  "changeToken": true
}
```

**Schema:**

- `capacity` (number, optional): Sức chứa mới
- `status` (string, optional): Trạng thái mới
- `changeToken` (boolean, optional): Có tạo token mới không

### Response

**Success (200):**

```json
{
  "data": {
    "number": 10,
    "capacity": 6,
    "status": "Reserved",
    "token": "new-generated-token",
    "createdAt": "2025-09-28T12:00:00.000Z",
    "updatedAt": "2025-09-28T12:30:00.000Z"
  },
  "message": "Cập nhật bàn thành công!"
}
```

**Error Responses:**

- `404`: Bàn không tồn tại

---

## DELETE /tables/:number

Xóa bàn khỏi hệ thống.

**Endpoint:** `DELETE /tables/{number}`

**Authentication:** Bearer Token (Owner hoặc Employee)

### Path Parameters

- `number` (number): Số bàn cần xóa

### Response

**Success (200):**

```json
{
  "message": "Xóa bàn thành công!",
  "data": {
    "number": 10,
    "capacity": 6,
    "status": "Reserved",
    "token": "deleted-table-token",
    "createdAt": "2025-09-28T12:00:00.000Z",
    "updatedAt": "2025-09-28T12:30:00.000Z"
  }
}
```

**Error Responses:**

- `404`: Bàn không tồn tại
- `400`: Không thể xóa bàn đang có khách

---

## Table Status

Bàn có các trạng thái sau:

- **Available**: Trống - có thể sử dụng
- **Occupied**: Có khách - đang sử dụng
- **Reserved**: Đã đặt trước
- **Hidden**: Ẩn - không hiển thị cho khách hàng

## Table Token

Mỗi bàn có một token duy nhất được sử dụng để:

- Tạo QR code cho bàn
- Xác thực khi khách hàng quét QR code
- Đăng nhập khách hàng vào bàn cụ thể

Token có thể được tái tạo thông qua việc cập nhật bàn với `changeToken: true`.

## Error Responses

**Common Error Codes:**

- `400`: Bad Request - Dữ liệu đầu vào không hợp lệ
- `401`: Unauthorized - Token không hợp lệ hoặc hết hạn
- `403`: Forbidden - Không có quyền truy cập
- `404`: Not Found - Bàn không tồn tại
- `409`: Conflict - Số bàn đã tồn tại
- `422`: Validation Error - Lỗi validation dữ liệu

## Notes

- Endpoint GET /tables và GET /tables/:number không yêu cầu authentication
- Token của bàn được tự động tạo khi tạo bàn mới
- Không thể xóa bàn đang có khách hoặc có đơn hàng chưa thanh toán
- Capacity phải là số dương
- Number phải là số dương và duy nhất trong hệ thống
