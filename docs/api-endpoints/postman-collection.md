# Postman Collection

Hệ thống đi kèm với Postman Collection hoàn chỉnh để test các API endpoints.

## File Collection

**Location:** `/server/Quản lý quán ăn.postman_collection.json`

## Import Collection

1. Mở Postman
2. Click **Import**
3. Chọn file `Quản lý quán ăn.postman_collection.json`
4. Collection sẽ được import với tất cả endpoints

## Environment Variables

Tạo Postman Environment với các biến sau:

```json
{
  "host": "http://localhost:4000",
  "ownerEmail": "admin@example.com",
  "ownerPassword": "admin123",
  "accessToken": "",
  "refreshToken": "",
  "guestAccessToken": "",
  "guestRefreshToken": ""
}
```

## Collection Structure

### 1. Auth

- **Login**: Đăng nhập và tự động lưu tokens
- **Refresh Token**: Làm mới access token
- **Logout**: Đăng xuất

### 2. Account Management

- **Get Account List**: Lấy danh sách nhân viên
- **Create Employee**: Tạo tài khoản nhân viên
- **Get Account Detail**: Lấy thông tin nhân viên
- **Update Employee**: Cập nhật thông tin nhân viên
- **Delete Employee**: Xóa tài khoản nhân viên
- **Get Me**: Lấy thông tin tài khoản hiện tại
- **Update Me**: Cập nhật thông tin cá nhân
- **Change Password**: Đổi mật khẩu
- **Create Guest**: Tạo tài khoản khách
- **Get Guest List**: Lấy danh sách khách

### 3. Dish Management

- **Get Dish List**: Lấy danh sách món ăn
- **Get Dish with Pagination**: Lấy món ăn có phân trang
- **Get Dish Detail**: Lấy chi tiết món ăn
- **Create Dish**: Tạo món ăn mới
- **Update Dish**: Cập nhật món ăn
- **Delete Dish**: Xóa món ăn

### 4. Table Management

- **Get Table List**: Lấy danh sách bàn
- **Get Table Detail**: Lấy thông tin bàn
- **Create Table**: Tạo bàn mới
- **Update Table**: Cập nhật thông tin bàn
- **Delete Table**: Xóa bàn

### 5. Order Management

- **Create Orders**: Tạo đơn hàng
- **Get Orders**: Lấy danh sách đơn hàng
- **Get Order Detail**: Lấy chi tiết đơn hàng
- **Update Order**: Cập nhật đơn hàng
- **Pay Orders**: Thanh toán đơn hàng

### 6. Guest APIs

- **Guest Login**: Đăng nhập khách hàng
- **Guest Logout**: Đăng xuất khách hàng
- **Guest Refresh Token**: Làm mới token khách
- **Guest Create Orders**: Khách đặt món
- **Guest Get Orders**: Lấy đơn hàng của khách

### 7. Media

- **Upload Image**: Upload hình ảnh

### 8. Indicators

- **Dashboard Stats**: Lấy thống kê dashboard

### 9. Static Files

- **Get Static File**: Truy cập file tĩnh

## Pre-request Scripts

Collection sử dụng pre-request scripts để:

- Tự động thêm Authorization header
- Kiểm tra token expiration
- Refresh token khi cần thiết

## Test Scripts

Mỗi request có test scripts để:

- Validate response status
- Extract và lưu tokens
- Verify response data structure
- Set environment variables

## Usage Examples

### 1. Authentication Flow

```
1. Run "Login" → Tokens được lưu tự động
2. Other requests sẽ tự động sử dụng tokens
3. Run "Refresh Token" khi access token hết hạn
```

### 2. Guest Flow

```
1. Run "Create Guest" để tạo khách
2. Run "Guest Login" với table token
3. Run "Guest Create Orders" để đặt món
4. Run "Guest Get Orders" để xem đơn hàng
```

### 3. Complete Order Flow

```
1. Run "Create Guest" (staff creates guest account)
2. Run "Guest Login" (guest scans QR and logs in)
3. Run "Guest Create Orders" (guest orders food)
4. Run "Get Orders" (staff sees new orders)
5. Run "Update Order" (staff updates order status)
6. Run "Pay Orders" (staff processes payment)
```

## Environment Setup

### Development

```json
{
  "host": "http://localhost:4000",
  "ownerEmail": "owner@example.com",
  "ownerPassword": "password123"
}
```

### Staging

```json
{
  "host": "https://staging-api.yourapp.com",
  "ownerEmail": "staging@example.com",
  "ownerPassword": "staging123"
}
```

### Production

```json
{
  "host": "https://api.yourapp.com",
  "ownerEmail": "admin@yourrestaurant.com",
  "ownerPassword": "secure_password"
}
```

## Common Issues

### 1. Token Expired

- Solution: Run "Refresh Token" request
- Auto-solution: Pre-request script handles this

### 2. Environment Variables Not Set

- Solution: Ensure environment is selected
- Check variable names match exactly

### 3. Host Connection Error

- Solution: Verify server is running on correct port
- Check host URL in environment

## Additional Notes

- Collection supports both Owner and Employee roles
- Guest endpoints require separate authentication
- File upload requires selecting actual file in body
- Some endpoints require specific order of execution
- Test scripts validate response structure automatically
