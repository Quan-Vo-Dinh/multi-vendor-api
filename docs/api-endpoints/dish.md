# Dish Management Routes

Base URL: `/dishes`

## GET /dishes

Lấy danh sách tất cả món ăn trong hệ thống.

**Endpoint:** `GET /dishes`

**Authentication:** Không yêu cầu

### Response

**Success (200):**

```json
{
  "data": [
    {
      "id": 1,
      "name": "Phở Bò",
      "price": 50000,
      "description": "Phở bò truyền thống với thịt bò tươi ngon",
      "image": "https://example.com/pho-bo.jpg",
      "status": "Available",
      "createdAt": "2025-09-28T10:00:00.000Z",
      "updatedAt": "2025-09-28T10:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Bánh Mì",
      "price": 25000,
      "description": "Bánh mì thịt nướng với rau sống",
      "image": "https://example.com/banh-mi.jpg",
      "status": "Available",
      "createdAt": "2025-09-28T10:00:00.000Z",
      "updatedAt": "2025-09-28T10:00:00.000Z"
    }
  ],
  "message": "Lấy danh sách món ăn thành công!"
}
```

---

## GET /dishes/pagination

Lấy danh sách món ăn với phân trang.

**Endpoint:** `GET /dishes/pagination`

**Authentication:** Không yêu cầu

### Query Parameters

- `page` (number, optional): Số trang (mặc định: 1)
- `limit` (number, optional): Số lượng món ăn mỗi trang (mặc định: 10)

**Example:** `/dishes/pagination?page=2&limit=5`

### Response

**Success (200):**

```json
{
  "data": {
    "items": [
      {
        "id": 6,
        "name": "Cơm Tấm",
        "price": 35000,
        "description": "Cơm tấm sườn nướng",
        "image": "https://example.com/com-tam.jpg",
        "status": "Available",
        "createdAt": "2025-09-28T10:00:00.000Z",
        "updatedAt": "2025-09-28T10:00:00.000Z"
      }
    ],
    "totalItem": 25,
    "totalPage": 5,
    "page": 2,
    "limit": 5
  },
  "message": "Lấy danh sách món ăn thành công!"
}
```

---

## GET /dishes/:id

Lấy thông tin chi tiết của một món ăn.

**Endpoint:** `GET /dishes/{id}`

**Authentication:** Không yêu cầu

### Path Parameters

- `id` (number): ID của món ăn

### Response

**Success (200):**

```json
{
  "data": {
    "id": 1,
    "name": "Phở Bò",
    "price": 50000,
    "description": "Phở bò truyền thống với thịt bò tươi ngon, nước dùng được ninh từ xương bò trong nhiều giờ",
    "image": "https://example.com/pho-bo.jpg",
    "status": "Available",
    "createdAt": "2025-09-28T10:00:00.000Z",
    "updatedAt": "2025-09-28T10:00:00.000Z"
  },
  "message": "Lấy thông tin món ăn thành công!"
}
```

**Error Responses:**

- `404`: Món ăn không tồn tại

---

## POST /dishes

Tạo món ăn mới.

**Endpoint:** `POST /dishes`

**Authentication:** Bearer Token (Owner hoặc Employee)

### Request Body

```json
{
  "name": "Bún Chả",
  "price": 45000,
  "description": "Bún chả Hà Nội với thịt nướng thơm lừng",
  "image": "https://example.com/bun-cha.jpg",
  "status": "Available"
}
```

**Schema:**

- `name` (string, required): Tên món ăn
- `price` (number, required): Giá món ăn (VNĐ)
- `description` (string, optional): Mô tả món ăn
- `image` (string, optional): URL hình ảnh món ăn
- `status` (string, required): Trạng thái ("Available", "Unavailable", "Hidden")

### Response

**Success (200):**

```json
{
  "data": {
    "id": 26,
    "name": "Bún Chả",
    "price": 45000,
    "description": "Bún chả Hà Nội với thịt nướng thơm lừng",
    "image": "https://example.com/bun-cha.jpg",
    "status": "Available",
    "createdAt": "2025-09-28T12:00:00.000Z",
    "updatedAt": "2025-09-28T12:00:00.000Z"
  },
  "message": "Tạo món ăn thành công!"
}
```

---

## PUT /dishes/:id

Cập nhật thông tin món ăn.

**Endpoint:** `PUT /dishes/{id}`

**Authentication:** Bearer Token (Owner hoặc Employee)

### Path Parameters

- `id` (number): ID của món ăn

### Request Body

```json
{
  "name": "Phở Bò Đặc Biệt",
  "price": 65000,
  "description": "Phở bò đặc biệt với đầy đủ topping",
  "image": "https://example.com/pho-bo-dac-biet.jpg",
  "status": "Available"
}
```

**Schema:** Tương tự như POST /dishes

### Response

**Success (200):**

```json
{
  "data": {
    "id": 1,
    "name": "Phở Bò Đặc Biệt",
    "price": 65000,
    "description": "Phở bò đặc biệt với đầy đủ topping",
    "image": "https://example.com/pho-bo-dac-biet.jpg",
    "status": "Available",
    "createdAt": "2025-09-28T10:00:00.000Z",
    "updatedAt": "2025-09-28T12:30:00.000Z"
  },
  "message": "Cập nhật món ăn thành công!"
}
```

**Error Responses:**

- `404`: Món ăn không tồn tại

---

## DELETE /dishes/:id

Xóa món ăn khỏi hệ thống.

**Endpoint:** `DELETE /dishes/{id}`

**Authentication:** Bearer Token (Owner hoặc Employee)

### Path Parameters

- `id` (number): ID của món ăn

### Response

**Success (200):**

```json
{
  "message": "Xóa món ăn thành công!",
  "data": {
    "id": 1,
    "name": "Phở Bò Đặc Biệt",
    "price": 65000,
    "description": "Phở bò đặc biệt với đầy đủ topping",
    "image": "https://example.com/pho-bo-dac-biet.jpg",
    "status": "Available",
    "createdAt": "2025-09-28T10:00:00.000Z",
    "updatedAt": "2025-09-28T12:30:00.000Z"
  }
}
```

**Error Responses:**

- `404`: Món ăn không tồn tại
- `400`: Không thể xóa món ăn đang có trong đơn hàng

---

## Dish Status

Món ăn có các trạng thái sau:

- **Available**: Có sẵn - khách hàng có thể đặt
- **Unavailable**: Tạm hết - hiển thị nhưng không thể đặt
- **Hidden**: Ẩn - không hiển thị cho khách hàng

## Error Responses

**Common Error Codes:**

- `400`: Bad Request - Dữ liệu đầu vào không hợp lệ
- `401`: Unauthorized - Token không hợp lệ hoặc hết hạn
- `403`: Forbidden - Không có quyền truy cập
- `404`: Not Found - Món ăn không tồn tại
- `422`: Validation Error - Lỗi validation dữ liệu

## Notes

- Endpoint GET /dishes và GET /dishes/pagination không yêu cầu authentication, cho phép khách hàng xem menu
- Các endpoint tạo, sửa, xóa món ăn yêu cầu quyền Owner hoặc Employee
- Hình ảnh món ăn có thể upload thông qua endpoint `/media/upload`
