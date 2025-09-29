# Indicator Routes

Base URL: `/indicators`

**Authentication:** Tất cả các endpoint yêu cầu Bearer Token (Owner hoặc Employee)

## GET /indicators/dashboard

Lấy các chỉ số thống kê cho dashboard quản lý.

**Endpoint:** `GET /indicators/dashboard`

**Authentication:** Bearer Token (Owner hoặc Employee)

### Query Parameters

- `fromDate` (string, optional): Ngày bắt đầu thống kê (ISO 8601)
- `toDate` (string, optional): Ngày kết thúc thống kê (ISO 8601)

**Example:** `/indicators/dashboard?fromDate=2025-09-01T00:00:00.000Z&toDate=2025-09-30T23:59:59.999Z`

### Response

**Success (200):**

```json
{
  "message": "Lấy các chỉ số thành công",
  "data": {
    "revenue": {
      "total": 15750000,
      "previousPeriod": 12300000,
      "growth": 28.0,
      "currency": "VND"
    },
    "orders": {
      "total": 350,
      "previousPeriod": 280,
      "growth": 25.0,
      "completed": 320,
      "pending": 15,
      "processing": 10,
      "rejected": 5
    },
    "customers": {
      "total": 145,
      "previousPeriod": 120,
      "growth": 20.8,
      "newCustomers": 45,
      "returningCustomers": 100
    },
    "dishes": {
      "total": 25,
      "available": 22,
      "unavailable": 2,
      "hidden": 1,
      "mostPopular": [
        {
          "id": 1,
          "name": "Phở Bò",
          "orderCount": 85,
          "revenue": 4250000
        },
        {
          "id": 3,
          "name": "Bánh Mì",
          "orderCount": 65,
          "revenue": 1625000
        }
      ]
    },
    "tables": {
      "total": 20,
      "available": 15,
      "occupied": 4,
      "reserved": 1,
      "occupancyRate": 25.0
    },
    "performance": {
      "averageOrderValue": 45000,
      "averageServiceTime": 18.5,
      "customerSatisfaction": 4.2,
      "peakHours": [
        {
          "hour": 12,
          "orderCount": 45
        },
        {
          "hour": 19,
          "orderCount": 38
        }
      ]
    },
    "trends": {
      "dailyRevenue": [
        {
          "date": "2025-09-01",
          "revenue": 520000,
          "orders": 12
        },
        {
          "date": "2025-09-02",
          "revenue": 680000,
          "orders": 15
        }
      ],
      "hourlyOrders": [
        {
          "hour": 6,
          "count": 2
        },
        {
          "hour": 7,
          "count": 8
        }
      ]
    }
  }
}
```

### Response Schema

#### Revenue

- `total` (number): Tổng doanh thu trong khoảng thời gian
- `previousPeriod` (number): Doanh thu kỳ trước (để so sánh)
- `growth` (number): Tỷ lệ tăng trưởng (%)
- `currency` (string): Đơn vị tiền tệ

#### Orders

- `total` (number): Tổng số đơn hàng
- `previousPeriod` (number): Số đơn hàng kỳ trước
- `growth` (number): Tỷ lệ tăng trưởng (%)
- `completed` (number): Đơn hàng hoàn thành
- `pending` (number): Đơn hàng chờ xử lý
- `processing` (number): Đơn hàng đang xử lý
- `rejected` (number): Đơn hàng bị từ chối

#### Customers

- `total` (number): Tổng số khách hàng
- `previousPeriod` (number): Số khách hàng kỳ trước
- `growth` (number): Tỷ lệ tăng trưởng (%)
- `newCustomers` (number): Khách hàng mới
- `returningCustomers` (number): Khách hàng quay lại

#### Dishes

- `total` (number): Tổng số món ăn
- `available` (number): Món ăn có sẵn
- `unavailable` (number): Món ăn tạm hết
- `hidden` (number): Món ăn ẩn
- `mostPopular` (array): Top món ăn được đặt nhiều nhất

#### Tables

- `total` (number): Tổng số bàn
- `available` (number): Bàn trống
- `occupied` (number): Bàn có khách
- `reserved` (number): Bàn đã đặt
- `occupancyRate` (number): Tỷ lệ lấp đầy (%)

#### Performance

- `averageOrderValue` (number): Giá trị đơn hàng trung bình
- `averageServiceTime` (number): Thời gian phục vụ trung bình (phút)
- `customerSatisfaction` (number): Điểm hài lòng khách hàng (1-5)
- `peakHours` (array): Giờ cao điểm

#### Trends

- `dailyRevenue` (array): Doanh thu theo ngày
- `hourlyOrders` (array): Đơn hàng theo giờ

### Error Responses

**Invalid Date Range (400):**

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Invalid date range. fromDate must be before toDate"
}
```

**Unauthorized (401):**

```json
{
  "statusCode": 401,
  "error": "Unauthorized",
  "message": "Token không hợp lệ"
}
```

## Usage Examples

### Get Current Month Statistics

```javascript
const now = new Date()
const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)

const response = await fetch(
  `/indicators/dashboard?fromDate=${firstDay.toISOString()}&toDate=${lastDay.toISOString()}`,
  {
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  },
)
```

### Get Today Statistics

```javascript
const today = new Date()
const startOfDay = new Date(today.setHours(0, 0, 0, 0))
const endOfDay = new Date(today.setHours(23, 59, 59, 999))

const response = await fetch(
  `/indicators/dashboard?fromDate=${startOfDay.toISOString()}&toDate=${endOfDay.toISOString()}`,
  {
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  },
)
```

### Get All Time Statistics

```javascript
// Không truyền fromDate và toDate để lấy tất cả
const response = await fetch('/indicators/dashboard', {
  headers: {
    Authorization: 'Bearer ' + accessToken,
  },
})
```

## Data Calculation

### Growth Rate

```
Growth Rate = ((Current Period - Previous Period) / Previous Period) * 100
```

### Occupancy Rate

```
Occupancy Rate = (Occupied + Reserved) / Total Tables * 100
```

### Average Order Value

```
AOV = Total Revenue / Total Orders
```

## Notes

- Nếu không truyền `fromDate` và `toDate`, hệ thống sẽ tính toàn bộ dữ liệu
- Previous period được tính dựa trên khoảng thời gian tương đương kỳ trước
- Tất cả giá trị tiền tệ đều tính bằng VNĐ
- Thời gian phục vụ tính từ khi tạo đơn đến khi hoàn thành
- Peak hours được xác định dựa trên số lượng đơn hàng cao nhất
- Customer satisfaction hiện tại là mock data, cần tích hợp hệ thống đánh giá
