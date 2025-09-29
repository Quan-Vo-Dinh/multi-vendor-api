# Static Routes

Base URL: `/static`

Endpoint để truy cập các file tĩnh đã được upload lên server.

## GET /static/:id

Truy cập file tĩnh theo tên file.

**Endpoint:** `GET /static/{filename}`

**Authentication:** Không yêu cầu

### Path Parameters

- `filename` (string): Tên file cần truy cập

### Response

**Success (200):**

- Trả về file binary với appropriate content-type headers
- Content-Type được tự động detect dựa trên file extension

**Examples:**

```http
GET /static/avatar-1695887234567.jpg
Content-Type: image/jpeg

GET /static/dish-image-1695887234567.png
Content-Type: image/png

GET /static/logo-1695887234567.gif
Content-Type: image/gif
```

**Error Responses:**

- `404`: File không tồn tại

---

## File Types Supported

Endpoint hỗ trợ tất cả các file types, nhưng chủ yếu được sử dụng cho:

### Images

- **JPEG/JPG**: `image/jpeg`
- **PNG**: `image/png`
- **GIF**: `image/gif`
- **WebP**: `image/webp`
- **SVG**: `image/svg+xml`

### Other Files

- **PDF**: `application/pdf`
- **Text**: `text/plain`
- **CSS**: `text/css`
- **JavaScript**: `application/javascript`

## Headers

### Response Headers

```http
Content-Type: [detected-mime-type]
Content-Length: [file-size]
Cache-Control: public, max-age=3600
ETag: [file-etag]
```

### CORS Headers

```http
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET
```

## Usage Examples

### Display Dish Image

```html
<img src="http://localhost:4000/static/dish-1695887234567.jpg" alt="Dish Image" />
```

### User Avatar

```html
<img src="http://localhost:4000/static/avatar-1695887234567.png" alt="User Avatar" />
```

### CSS Background

```css
.hero-bg {
  background-image: url('http://localhost:4000/static/hero-1695887234567.jpg');
}
```

### JavaScript Fetch

```javascript
const response = await fetch('/static/document-1695887234567.pdf')
const blob = await response.blob()
```

## File Security

### Public Access

- Tất cả file trong `/static` đều có thể truy cập công khai
- Không yêu cầu authentication
- Không có access control

### File Naming

- File được đổi tên khi upload để tránh conflict
- Format: `original-name-timestamp.extension`
- Timestamp giúp file có tên unique

### Directory Traversal Protection

- Server có bảo vệ chống directory traversal attacks
- Chỉ có thể truy cập file trong upload directory
- Không thể access file system khác

## Performance

### Caching

- File được cache với `max-age=3600` (1 giờ)
- Browser sẽ cache file để giảm load server
- ETag được sử dụng để validate cache

### File Serving

- Sử dụng `@fastify/static` plugin để serve file hiệu quả
- Stream file content thay vì load toàn bộ vào memory
- Hỗ trợ Range requests cho video/audio files

## Error Responses

**File Not Found (404):**

```json
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "File not found"
}
```

## Notes

- Endpoint này được sử dụng để serve file đã upload qua `/media/upload`
- File path trả về từ upload endpoint có thể dùng trực tiếp
- Không có tính năng xóa file qua API
- File sẽ tồn tại vĩnh viễn trừ khi xóa thủ công
- Nên sử dụng CDN cho production để tăng performance
