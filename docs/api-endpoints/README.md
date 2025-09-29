# API Documentation - QR Food Ordering System

Hệ thống API cho ứng dụng đặt món ăn qua mã QR. API được xây dựng trên Fastify framework với TypeScript.

## Tổng quan

- **Backend Framework**: Fastify
- **Database**: PostgreSQL với Prisma ORM
- **Authentication**: JWT (Access Token + Refresh Token)
- **Authorization**: Role-based (Owner, Employee, Guest)
- **API Style**: RESTful
- **Validation**: Zod schemas

## Base URL

```
http://localhost:4000
```

## Authentication

Hệ thống sử dụng JWT với 2 loại token:

- **Access Token**: Hết hạn sau 15 phút
- **Refresh Token**: Hết hạn sau 7 ngày

### Headers yêu cầu cho các API cần xác thực:

```http
Authorization: Bearer <access_token>
```

## User Roles

1. **Owner**: Chủ quán - có quyền cao nhất
2. **Employee**: Nhân viên - quyền hạn giới hạn
3. **Guest**: Khách hàng - chỉ có thể đặt món và xem đơn hàng của mình

## API Endpoints

### Authentication Routes (`/auth`)

- [POST /auth/login](./auth.md#post-authlogin) - Đăng nhập
- [POST /auth/logout](./auth.md#post-authlogout) - Đăng xuất
- [POST /auth/refresh-token](./auth.md#post-authrefresh-token) - Làm mới token
- [GET /auth/login/google](./auth.md#get-authlogingoogle) - Đăng nhập Google

### Account Management Routes (`/accounts`)

- [GET /accounts](./account.md#get-accounts) - Lấy danh sách nhân viên
- [POST /accounts](./account.md#post-accounts) - Tạo tài khoản nhân viên
- [GET /accounts/me](./account.md#get-accountsme) - Lấy thông tin tài khoản hiện tại
- [PUT /accounts/me](./account.md#put-accountsme) - Cập nhật thông tin cá nhân
- [GET /accounts/detail/:id](./account.md#get-accountsdetailid) - Lấy thông tin nhân viên
- [PUT /accounts/detail/:id](./account.md#put-accountsdetailid) - Cập nhật thông tin nhân viên
- [DELETE /accounts/detail/:id](./account.md#delete-accountsdetailid) - Xóa tài khoản nhân viên
- [PUT /accounts/change-password](./account.md#put-accountschange-password) - Đổi mật khẩu
- [PUT /accounts/change-password-v2](./account.md#put-accountschange-password-v2) - Đổi mật khẩu v2
- [POST /accounts/guests](./account.md#post-accountsguests) - Tạo tài khoản khách
- [GET /accounts/guests](./account.md#get-accountsguests) - Lấy danh sách khách

### Dish Management Routes (`/dishes`)

- [GET /dishes](./dish.md#get-dishes) - Lấy danh sách món ăn
- [GET /dishes/pagination](./dish.md#get-dishespagination) - Lấy danh sách món ăn có phân trang
- [GET /dishes/:id](./dish.md#get-dishesid) - Lấy chi tiết món ăn
- [POST /dishes](./dish.md#post-dishes) - Tạo món ăn mới
- [PUT /dishes/:id](./dish.md#put-dishesid) - Cập nhật món ăn
- [DELETE /dishes/:id](./dish.md#delete-dishesid) - Xóa món ăn

### Table Management Routes (`/tables`)

- [GET /tables](./table.md#get-tables) - Lấy danh sách bàn
- [GET /tables/:number](./table.md#get-tablesnumber) - Lấy thông tin bàn
- [POST /tables](./table.md#post-tables) - Tạo bàn mới
- [PUT /tables/:number](./table.md#put-tablesnumber) - Cập nhật thông tin bàn
- [DELETE /tables/:number](./table.md#delete-tablesnumber) - Xóa bàn

### Order Management Routes (`/orders`)

- [POST /orders](./order.md#post-orders) - Tạo đơn hàng
- [GET /orders](./order.md#get-orders) - Lấy danh sách đơn hàng
- [GET /orders/:orderId](./order.md#get-ordersorderid) - Lấy chi tiết đơn hàng
- [PUT /orders/:orderId](./order.md#put-ordersorderid) - Cập nhật đơn hàng
- [POST /orders/pay](./order.md#post-orderspay) - Thanh toán đơn hàng

### Guest Routes (`/guest`)

- [POST /guest/auth/login](./guest.md#post-guestauthlogin) - Đăng nhập khách
- [POST /guest/auth/logout](./guest.md#post-guestauthlogout) - Đăng xuất khách
- [POST /guest/auth/refresh-token](./guest.md#post-guestauthrefresh-token) - Làm mới token khách
- [POST /guest/orders](./guest.md#post-guestorders) - Khách đặt món
- [GET /guest/orders](./guest.md#get-guestorders) - Lấy đơn hàng của khách

### Media Routes (`/media`)

- [POST /media/upload](./media.md#post-mediaupload) - Upload hình ảnh

### Static Routes (`/static`)

- [GET /static/:id](./static.md#get-staticid) - Lấy file tĩnh

### Indicator Routes (`/indicators`)

- [GET /indicators/dashboard](./indicator.md#get-indicatorsdashboard) - Lấy thống kê dashboard

## Error Handling

API sử dụng HTTP status codes chuẩn:

- `200`: Success
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `422`: Validation Error
- `500`: Internal Server Error

### Error Response Format

```json
{
  "message": "Error message",
  "statusCode": 400,
  "error": "Bad Request"
}
```

## Common Response Format

### Success Response

```json
{
  "data": {}, // hoặc []
  "message": "Success message"
}
```

### Message Only Response

```json
{
  "message": "Success message"
}
```

## WebSocket Events

Hệ thống hỗ trợ WebSocket cho real-time updates:

- `new-order`: Thông báo đơn hàng mới
- `refresh-token`: Yêu cầu refresh token
- `logout`: Thông báo đăng xuất

## Rate Limiting & Security

- API có middleware bảo mật với Helmet
- CORS được cấu hình cho phép cross-origin requests
- Validation được thực hiện bằng Zod schemas
- File upload giới hạn 10MB

## Testing

### Postman Collection

- [Postman Collection Guide](./postman-collection.md) - Hướng dẫn sử dụng Postman collection
- **File**: `/server/Quản lý quán ăn.postman_collection.json`
- Import collection vào Postman để test tất cả endpoints

### Quick Start Testing

1. Import Postman collection
2. Set up environment variables (host, credentials)
3. Run "Login" request để authenticate
4. Test các endpoints khác

## WebSocket Integration

API hỗ trợ WebSocket cho real-time features:

- Server URL: `http://localhost:4000`
- Namespace: `/` (default)
- Events: `new-order`, `refresh-token`, `logout`
