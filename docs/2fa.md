## 🧩 Mục đích của flow này

Flow này dùng để **thêm lớp bảo mật thứ hai** khi người dùng đăng nhập (ngoài mật khẩu).
Cụ thể:

- Bình thường chỉ cần **email + password** là đăng nhập được.
- Nhưng nếu bật **2FA**, thì **ngay cả khi hacker biết mật khẩu**, họ **vẫn không thể đăng nhập**, vì còn cần mã **OTP 6 số** được sinh ra trong ứng dụng như _Google Authenticator_ hoặc _Authy_.

→ Vậy **mục tiêu** là: bảo vệ tài khoản trong trường hợp **mật khẩu bị lộ**.

---

## 🔁 Flow chi tiết (theo các API trong ảnh)

### 1. `/2fa/setup` – Tạo mã 2FA

Khi user bật tính năng 2FA:

1. **Backend** tạo ra một `secret key` duy nhất cho user.
2. Từ `secret key`, backend tạo **Key URI** để **frontend** hiển thị dưới dạng **QR Code**.
3. Người dùng quét QR đó bằng app như _Google Authenticator_ → app sẽ lưu secret và bắt đầu sinh mã OTP 6 số mỗi 30s.
4. Backend lưu `secret` này (mã hóa hoặc hash) trong DB, ví dụ trong cột `totpSecret`.

> 🔒 Mục đích: liên kết tài khoản với một nguồn tạo mã OTP duy nhất.

---

### 2. `/2fa/verify` (hoặc trong login API) – Xác thực mã OTP

Khi user đăng nhập:

1. Họ nhập **email + password** → Backend kiểm tra hợp lệ.
2. Nếu user có `totpSecret` (tức đã bật 2FA) → backend yêu cầu nhập **mã OTP**.
3. Backend dùng `totpSecret` để **tự tính ra mã hợp lệ** (ví dụ bằng thư viện `speakeasy` hoặc `otplib`) và so sánh với mã user gửi.
4. Nếu trùng → cho đăng nhập; nếu sai → từ chối.

> 🔒 Mục đích: chỉ cho phép truy cập nếu có thiết bị chứa app tạo mã.

---

### 3. `/2fa/disable` – Vô hiệu hóa 2FA

Khi user muốn tắt:

- Gửi request kèm mã OTP hợp lệ.
- Backend xác minh OTP, sau đó xóa `totpSecret` khỏi DB.
- Từ đó user không cần nhập mã 2FA khi login nữa.

> 🔒 Mục đích: cho phép người dùng chủ động bật/tắt bảo mật 2 lớp.

---

## 💡 Backup / Khôi phục

Phần cuối trong ảnh nói đến:

> “Giải pháp backup trong trường hợp người dùng đánh mất điện thoại.”

👉 Điều này rất thực tế: nếu mất điện thoại, bạn **không thể sinh mã OTP nữa**.
Các giải pháp phổ biến:

1. Cung cấp **backup codes** (chuỗi mã dùng 1 lần) để khôi phục.
2. Cho phép **xác minh qua email/SMS** như bước thay thế.
3. Hoặc **admin/staff có quyền vô hiệu hóa 2FA tạm thời** cho user.

---

## 🔍 Tóm tắt tư duy triển khai

| Giai đoạn                   | Mục đích                                      | Backend cần làm                                |
| --------------------------- | --------------------------------------------- | ---------------------------------------------- |
| `/2fa/setup`                | Tạo liên kết giữa user và ứng dụng tạo mã OTP | Sinh `secret`, trả `keyURI`, lưu secret vào DB |
| `/login` hoặc `/2fa/verify` | Xác thực mã OTP do user nhập                  | Dùng thư viện `totp.verify()` để check         |
| `/2fa/disable`              | Gỡ bỏ bảo mật 2FA                             | Xác minh OTP hợp lệ → xóa secret               |
| Backup flow                 | Khôi phục khi mất điện thoại                  | Cho phép disable hoặc dùng mã dự phòng         |

---

Nếu bạn muốn, tôi có thể vẽ **sơ đồ `mermaid`** minh họa toàn bộ luồng 2FA này (setup → login → verify → disable → backup).
Bạn có muốn tôi thêm sơ đồ đó để trực quan hóa luôn không?
