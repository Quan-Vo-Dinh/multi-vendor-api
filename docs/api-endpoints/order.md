# Order Management Routes

Base URL: `/orders`

**Authentication:** Tất cả các endpoint yêu cầu Bearer Token (Owner hoặc Employee)

## POST /orders

Tạo đơn hàng mới cho khách hàng.

**Endpoint:** `POST /orders`

**Authentication:** Bearer Token (Owner hoặc Employee)

### Request Body

```json
{
  "guestId": 1,
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

- `guestId` (number, required): ID của khách hàng
- `orders` (array, required): Danh sách món đặt
  - `dishId` (number, required): ID của món ăn
  - `quantity` (number, required): Số lượng (> 0)

### Response

**Success (200):**

```json
{
  "message": "Tạo thành công 2 đơn hàng cho khách hàng",
  "data": [
    {
      "id": 101,
      "guestId": 1,
      "dishId": 1,
      "quantity": 2,
      "orderHandlerId": 5,
      "dishSnapshot": {
        "id": 1,
        "name": "Phở Bò",
        "price": 50000,
        "image": "https://example.com/pho-bo.jpg"
      },
      "price": 50000,
      "status": "Pending",
      "createdAt": "2025-09-28T12:00:00.000Z",
      "updatedAt": "2025-09-28T12:00:00.000Z"
    },
    {
      "id": 102,
      "guestId": 1,
      "dishId": 3,
      "quantity": 1,
      "orderHandlerId": 5,
      "dishSnapshot": {
        "id": 3,
        "name": "Bánh Mì",
        "price": 25000,
        "image": "https://example.com/banh-mi.jpg"
      },
      "price": 25000,
      "status": "Pending",
      "createdAt": "2025-09-28T12:00:00.000Z",
      "updatedAt": "2025-09-28T12:00:00.000Z"
    }
  ]
}
```

**Note:** Hệ thống sẽ gửi WebSocket event "new-order" đến tất cả manager và khách hàng (nếu có socketId).

---

## GET /orders

Lấy danh sách đơn hàng với bộ lọc theo ngày.

**Endpoint:** `GET /orders`

**Authentication:** Bearer Token (Owner hoặc Employee)

### Query Parameters

- `fromDate` (string, optional): Ngày bắt đầu (ISO 8601)
- `toDate` (string, optional): Ngày kết thúc (ISO 8601)

**Example:** `/orders?fromDate=2025-09-28T00:00:00.000Z&toDate=2025-09-28T23:59:59.999Z`

### Response

**Success (200):**

```json
{
  "message": "Lấy danh sách đơn hàng thành công",
  "data": [
    {
      "id": 101,
      "guestId": 1,
      "dishId": 1,
      "quantity": 2,
      "orderHandlerId": 5,
      "dishSnapshot": {
        "id": 1,
        "name": "Phở Bò",
        "price": 50000,
        "image": "https://example.com/pho-bo.jpg"
      },
      "price": 50000,
      "status": "Completed",
      "createdAt": "2025-09-28T12:00:00.000Z",
      "updatedAt": "2025-09-28T12:30:00.000Z",
      "guest": {
        "id": 1,
        "name": "Nguyễn Văn A",
        "tableNumber": 5
      },
      "orderHandler": {
        "id": 5,
        "name": "Nhân viên A"
      }
    }
  ]
}
```

---

## GET /orders/:orderId

Lấy chi tiết một đơn hàng.

**Endpoint:** `GET /orders/{orderId}`

**Authentication:** Bearer Token (Owner hoặc Employee)

### Path Parameters

- `orderId` (number): ID của đơn hàng

### Response

**Success (200):**

```json
{
  "message": "Lấy chi tiết đơn hàng thành công",
  "data": {
    "id": 101,
    "guestId": 1,
    "dishId": 1,
    "quantity": 2,
    "orderHandlerId": 5,
    "dishSnapshot": {
      "id": 1,
      "name": "Phở Bò",
      "price": 50000,
      "image": "https://example.com/pho-bo.jpg",
      "description": "Phở bò truyền thống"
    },
    "price": 50000,
    "status": "Completed",
    "createdAt": "2025-09-28T12:00:00.000Z",
    "updatedAt": "2025-09-28T12:30:00.000Z",
    "guest": {
      "id": 1,
      "name": "Nguyễn Văn A",
      "tableNumber": 5,
      "createdAt": "2025-09-28T11:00:00.000Z"
    },
    "orderHandler": {
      "id": 5,
      "name": "Nhân viên A",
      "email": "nhanvien@example.com"
    }
  }
}
```

**Error Responses:**

- `404`: Đơn hàng không tồn tại

---

## PUT /orders/:orderId

Cập nhật trạng thái đơn hàng.

**Endpoint:** `PUT /orders/{orderId}`

**Authentication:** Bearer Token (Owner hoặc Employee)

### Path Parameters

- `orderId` (number): ID của đơn hàng

### Request Body

```json
{
  "status": "Processing",
  "dishId": 1,
  "quantity": 3
}
```

**Schema:**

- `status` (string, required): Trạng thái mới ("Pending", "Processing", "Completed", "Rejected")
- `dishId` (number, optional): ID món ăn mới (nếu thay đổi)
- `quantity` (number, optional): Số lượng mới (> 0)

### Response

**Success (200):**

```json
{
  "message": "Cập nhật đơn hàng thành công",
  "data": {
    "id": 101,
    "guestId": 1,
    "dishId": 1,
    "quantity": 3,
    "orderHandlerId": 5,
    "dishSnapshot": {
      "id": 1,
      "name": "Phở Bò",
      "price": 50000,
      "image": "https://example.com/pho-bo.jpg"
    },
    "price": 50000,
    "status": "Processing",
    "createdAt": "2025-09-28T12:00:00.000Z",
    "updatedAt": "2025-09-28T12:45:00.000Z"
  }
}
```

**Error Responses:**

- `404`: Đơn hàng không tồn tại
- `400`: Không thể cập nhật đơn hàng đã hoàn thành

---

## POST /orders/pay

Thanh toán đơn hàng cho khách.

**Endpoint:** `POST /orders/pay`

**Authentication:** Bearer Token (Owner hoặc Employee)

### Request Body

```json
{
  "guestId": 1,
  "orderIds": [101, 102, 103]
}
```

**Schema:**

- `guestId` (number, required): ID của khách hàng
- `orderIds` (array, required): Danh sách ID đơn hàng cần thanh toán

### Response

**Success (200):**

```json
{
  "message": "Thanh toán thành công cho 3 đơn hàng",
  "data": {
    "guest": {
      "id": 1,
      "name": "Nguyễn Văn A",
      "tableNumber": 5
    },
    "orders": [
      {
        "id": 101,
        "quantity": 2,
        "price": 50000,
        "status": "Paid",
        "dishSnapshot": {
          "name": "Phở Bò",
          "price": 50000
        }
      }
    ],
    "totalAmount": 125000
  }
}
```

**Error Responses:**

- `404`: Khách hàng hoặc đơn hàng không tồn tại
- `400`: Một số đơn hàng đã được thanh toán hoặc không hợp lệ

---

## Order Status

Đơn hàng có các trạng thái sau:

- **Pending**: Chờ xử lý - đơn hàng mới tạo
- **Processing**: Đang chuẩn bị - bếp đang làm món
- **Completed**: Hoàn thành - món đã phục vụ
- **Rejected**: Từ chối - không thể thực hiện đơn hàng
- **Paid**: Đã thanh toán - khách đã trả tiền

## Dish Snapshot

Khi tạo đơn hàng, hệ thống sẽ lưu snapshot của món ăn tại thời điểm đặt:

- Tên món
- Giá
- Hình ảnh
- Mô tả

Điều này đảm bảo thông tin đơn hàng không bị thay đổi khi món ăn được cập nhật.

## WebSocket Events

- **new-order**: Gửi đến manager room và guest khi có đơn hàng mới
- **order-updated**: Gửi khi trạng thái đơn hàng thay đổi
- **order-paid**: Gửi khi đơn hàng được thanh toán

## Error Responses

**Common Error Codes:**

- `400`: Bad Request - Dữ liệu không hợp lệ hoặc đơn hàng không thể xử lý
- `401`: Unauthorized - Token không hợp lệ
- `403`: Forbidden - Không có quyền truy cập
- `404`: Not Found - Đơn hàng, khách hàng hoặc món ăn không tồn tại
- `422`: Validation Error - Lỗi validation dữ liệu

## Notes

- orderHandlerId là ID của nhân viên tạo đơn hàng
- Giá trong đơn hàng là giá tại thời điểm đặt (từ dishSnapshot)
- Không thể xóa đơn hàng, chỉ có thể từ chối (Rejected)
- Đơn hàng đã thanh toán không thể thay đổi trạng thái
