# Guest Routes

Base URL: `/guest`

Các endpoint dành cho khách hàng sử dụng sau khi quét QR code của bàn.

## POST /guest/auth/login

Đăng nhập khách hàng vào bàn thông qua QR code token.

**Endpoint:** `POST /guest/auth/login`

**Authentication:** Không yêu cầu

### Request Body

```json
{
  "name": "Nguyễn Văn A",
  "token": "table-token-abc123",
  "tableNumber": 5
}
```

**Schema:**

- `name` (string, required): Tên khách hàng
- `token` (string, required): Token từ QR code của bàn
- `tableNumber` (number, required): Số bàn

### Response

**Success (200):**

```json
{
  "message": "Đăng nhập thành công",
  "data": {
    "guest": {
      "id": 1,
      "name": "Nguyễn Văn A",
      "role": "Guest",
      "tableNumber": 5,
      "createdAt": "2025-09-28T12:00:00.000Z",
      "updatedAt": "2025-09-28T12:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

- `400`: Token không hợp lệ hoặc bàn không khả dụng
- `404`: Bàn không tồn tại
- `422`: Dữ liệu đầu vào không hợp lệ

---

## POST /guest/auth/logout

Đăng xuất khách hàng và vô hiệu hóa refresh token.

**Endpoint:** `POST /guest/auth/logout`

**Authentication:** Bearer Token (Guest)

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
- `422`: Refresh token không đúng định dạng

---

## POST /guest/auth/refresh-token

Làm mới access token cho khách hàng.

**Endpoint:** `POST /guest/auth/refresh-token`

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

---

## POST /guest/orders

Khách hàng tự đặt món ăn.

**Endpoint:** `POST /guest/orders`

**Authentication:** Bearer Token (Guest)

### Request Body

```json
{
  "orders": [
    {
      "dishId": 1,
      "quantity": 2
    },
    {
      "dishId": 3,
      "quantity": 1
    }
  ]
}
```

**Schema:**

- `orders` (array, required): Danh sách món đặt
  - `dishId` (number, required): ID của món ăn
  - `quantity` (number, required): Số lượng (> 0)

### Response

**Success (200):**

```json
{
  "message": "Đặt món thành công",
  "data": [
    {
      "id": 201,
      "guestId": 1,
      "dishId": 1,
      "quantity": 2,
      "dishSnapshot": {
        "id": 1,
        "name": "Phở Bò",
        "price": 50000,
        "image": "https://example.com/pho-bo.jpg"
      },
      "price": 50000,
      "status": "Pending",
      "createdAt": "2025-09-28T12:30:00.000Z",
      "updatedAt": "2025-09-28T12:30:00.000Z"
    },
    {
      "id": 202,
      "guestId": 1,
      "dishId": 3,
      "quantity": 1,
      "dishSnapshot": {
        "id": 3,
        "name": "Bánh Mì",
        "price": 25000,
        "image": "https://example.com/banh-mi.jpg"
      },
      "price": 25000,
      "status": "Pending",
      "createdAt": "2025-09-28T12:30:00.000Z",
      "updatedAt": "2025-09-28T12:30:00.000Z"
    }
  ]
}
```

**Error Responses:**

- `400`: Món ăn không khả dụng hoặc không tồn tại
- `401`: Token không hợp lệ
- `422`: Dữ liệu đầu vào không hợp lệ

**Note:** Hệ thống sẽ gửi WebSocket event "new-order" đến manager room.

---

## GET /guest/orders

Lấy danh sách đơn hàng của khách hiện tại.

**Endpoint:** `GET /guest/orders`

**Authentication:** Bearer Token (Guest)

### Response

**Success (200):**

```json
{
  "message": "Lấy danh sách đơn hàng thành công",
  "data": [
    {
      "id": 201,
      "dishId": 1,
      "quantity": 2,
      "dishSnapshot": {
        "id": 1,
        "name": "Phở Bò",
        "price": 50000,
        "image": "https://example.com/pho-bo.jpg"
      },
      "price": 50000,
      "status": "Processing",
      "createdAt": "2025-09-28T12:30:00.000Z",
      "updatedAt": "2025-09-28T12:45:00.000Z"
    },
    {
      "id": 202,
      "dishId": 3,
      "quantity": 1,
      "dishSnapshot": {
        "id": 3,
        "name": "Bánh Mì",
        "price": 25000,
        "image": "https://example.com/banh-mi.jpg"
      },
      "price": 25000,
      "status": "Completed",
      "createdAt": "2025-09-28T12:30:00.000Z",
      "updatedAt": "2025-09-28T12:50:00.000Z"
    }
  ]
}
```

**Error Responses:**

- `401`: Token không hợp lệ

---

## Guest Flow

1. **Quét QR Code**: Khách quét QR code trên bàn để lấy token
2. **Đăng nhập**: Sử dụng token để đăng nhập và tạo guest session
3. **Xem menu**: Truy cập `/dishes` để xem menu (không cần auth)
4. **Đặt món**: Sử dụng `/guest/orders` để đặt món
5. **Theo dõi đơn hàng**: Sử dụng `/guest/orders` để xem trạng thái đơn hàng
6. **Thanh toán**: Gọi nhân viên để thanh toán

## Token Expiration

- **Access Token**: 15 phút
- **Refresh Token**: 7 ngày

## WebSocket Events

Khách hàng có thể nhận các WebSocket events:

- **order-status-updated**: Khi trạng thái đơn hàng thay đổi
- **new-dish-available**: Khi có món mới
- **table-call-staff**: Khi cần gọi nhân viên

## Error Responses

**Common Error Codes:**

- `400`: Bad Request - Dữ liệu không hợp lệ
- `401`: Unauthorized - Token không hợp lệ hoặc hết hạn
- `403`: Forbidden - Không có quyền truy cập
- `404`: Not Found - Bàn hoặc món ăn không tồn tại
- `422`: Validation Error - Lỗi validation dữ liệu

## Notes

- Guest chỉ có thể xem và tạo đơn hàng cho chính mình
- Không thể cập nhật hoặc hủy đơn hàng sau khi đã tạo
- Token bàn có thể hết hạn hoặc bị reset bởi nhân viên
- Một bàn có thể có nhiều guest cùng lúc
- Guest session sẽ tự động kết thúc khi bàn được reset
