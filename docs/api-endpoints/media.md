# Media Routes

Base URL: `/media`

**Authentication:** Tất cả các endpoint yêu cầu Bearer Token (Owner hoặc Employee)

## POST /media/upload

Upload hình ảnh lên server.

**Endpoint:** `POST /media/upload`

**Authentication:** Bearer Token (Owner hoặc Employee)

### Request

**Content-Type:** `multipart/form-data`

**Body:**

```
file: [Image File]
```

**File Requirements:**

- **Kích thước tối đa**: 10MB
- **Định dạng hỗ trợ**: JPG, JPEG, PNG, GIF, WebP
- **Field name**: `file`

### Response

**Success (200):**

```json
{
  "message": "Upload hình ảnh thành công",
  "data": {
    "name": "uploaded-image-1695887234567.jpg",
    "url": "http://localhost:4000/static/uploaded-image-1695887234567.jpg"
  }
}
```

**Response Schema:**

- `name` (string): Tên file sau khi được rename
- `url` (string): URL đầy đủ để truy cập file

**Error Responses:**

- `400`: File không hợp lệ hoặc quá lớn
- `401`: Token không hợp lệ
- `403`: Không có quyền upload
- `413`: File vượt quá giới hạn 10MB
- `415`: Định dạng file không được hỗ trợ

---

## File Storage

### Storage Location

File được lưu trong thư mục `uploads/` trên server.

### File Naming Convention

File sẽ được đổi tên theo format:

```
original-name-timestamp.extension
```

Ví dụ:

- Input: `avatar.jpg`
- Output: `avatar-1695887234567.jpg`

### File Access

File có thể được truy cập thông qua Static Routes:

```
GET /static/{filename}
```

### Security Features

- Giới hạn kích thước file: 10MB
- Chỉ chấp nhận file hình ảnh
- Đổi tên file để tránh conflict
- Yêu cầu authentication để upload

## Usage Examples

### Upload Avatar

```javascript
const formData = new FormData()
formData.append('file', avatarFile)

const response = await fetch('/media/upload', {
  method: 'POST',
  headers: {
    Authorization: 'Bearer ' + accessToken,
  },
  body: formData,
})

const result = await response.json()
// result.data.url có thể dùng làm avatar URL
```

### Upload Dish Image

```javascript
const formData = new FormData()
formData.append('file', dishImage)

const response = await fetch('/media/upload', {
  method: 'POST',
  headers: {
    Authorization: 'Bearer ' + accessToken,
  },
  body: formData,
})

const result = await response.json()
// Sử dụng result.data.url trong POST /dishes
```

## Error Responses

**File Too Large (413):**

```json
{
  "statusCode": 413,
  "error": "Payload Too Large",
  "message": "File size exceeds 10MB limit"
}
```

**Invalid File Type (415):**

```json
{
  "statusCode": 415,
  "error": "Unsupported Media Type",
  "message": "Only image files are allowed"
}
```

**No File Provided (400):**

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "No file provided"
}
```

## Notes

- File upload sử dụng `@fastify/multipart` plugin
- Server tự động tạo thư mục `uploads/` nếu chưa tồn tại
- File được serve thông qua `/static` endpoint với appropriate headers
- Không có tính năng xóa file tự động - cần quản lý thủ công
- URL trả về là absolute URL có thể sử dụng ngay trong frontend
