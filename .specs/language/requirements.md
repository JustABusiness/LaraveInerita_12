# Requirements — Language (Quản lý Ngôn ngữ)

> **Status:** DONE
> **Author:** Dev Team
> **Created:** 2026-06-01
> **Last Updated:** 2026-06-21
> **Reviewer:** Lead Dev

---

## 1. Bối cảnh (Context)

Hệ thống cần hỗ trợ đa ngôn ngữ (i18n). Admin cần một giao diện để quản lý danh sách
ngôn ngữ được hỗ trợ trong nền tảng (ví dụ: Tiếng Việt, Tiếng Anh).

Mỗi ngôn ngữ cần có canonical slug (ví dụ: `vn`, `en`) để hệ thống routing và
content management sử dụng.

---

## 2. Mục tiêu (Goals)

- [x] Admin có thể tạo, đọc, sửa, xóa ngôn ngữ (CRUD)
- [x] Mỗi ngôn ngữ có: tên, canonical slug, mô tả, ảnh đại diện (cờ quốc gia)
- [x] Hỗ trợ tìm kiếm theo tên và mô tả
- [x] Hỗ trợ lọc theo trạng thái publish (1=active, 2=inactive)
- [x] Hỗ trợ soft delete và bulk delete
- [x] Chỉ user đã đăng nhập mới có quyền truy cập

## 2a. Không phải mục tiêu (Non-Goals)

- Chưa tích hợp với content translation (phase 2)
- Chưa có frontend_default/backend_default switch trên UI (chỉ có trong DB)
- Không hỗ trợ import/export ngôn ngữ từ file

---

## 3. User Stories

### US-001: Xem danh sách ngôn ngữ

**As a** `admin`
**I want to** xem danh sách tất cả ngôn ngữ có phân trang
**So that** tôi có thể nắm bắt toàn bộ ngôn ngữ đang được hỗ trợ

#### Acceptance Criteria:
- [x] AC-001-1: Hiển thị danh sách ngôn ngữ với tên, canonical, ảnh, trạng thái
- [x] AC-001-2: Phân trang (mặc định 15 records/page)
- [x] AC-001-3: Có thể tìm kiếm theo `name` hoặc `description`
- [x] AC-001-4: Có thể lọc theo `publish` (1=active, 2=inactive)
- [x] AC-001-5: Guest (chưa đăng nhập) bị redirect về `/login`

### US-002: Tạo ngôn ngữ mới

**As a** `admin`
**I want to** thêm một ngôn ngữ mới vào hệ thống
**So that** nền tảng có thể hỗ trợ thêm ngôn ngữ đó

#### Acceptance Criteria:
- [x] AC-002-1: Form có các field: name (required), canonical (required), description, image
- [x] AC-002-2: Validate: name và canonical không được rỗng, max 255 ký tự
- [x] AC-002-3: Image chỉ chấp nhận jpeg/png/jpg/gif/svg, max 2MB
- [x] AC-002-4: Sau khi tạo thành công, hiển thị toast "Thêm mới thành công"
- [x] AC-002-5: Nếu validation fail, hiển thị lỗi ngay tại field tương ứng
- [x] AC-002-6: `user_id` được tự động gán theo user đang đăng nhập

### US-003: Sửa ngôn ngữ

**As a** `admin`
**I want to** chỉnh sửa thông tin ngôn ngữ đã tồn tại
**So that** tôi có thể cập nhật thông tin khi cần

#### Acceptance Criteria:
- [x] AC-003-1: Form pre-fill đầy đủ dữ liệu hiện tại của record
- [x] AC-003-2: Có thể cập nhật ảnh mới (thay thế ảnh cũ)
- [x] AC-003-3: Sử dụng POST với `_method=PUT` để xử lý multipart/form-data
- [x] AC-003-4: Sau khi lưu thành công, hiển thị toast "Cập nhật thành công"

### US-004: Xóa ngôn ngữ

**As a** `admin`
**I want to** xóa ngôn ngữ không còn sử dụng
**So that** danh sách được dọn dẹp gọn gàng

#### Acceptance Criteria:
- [x] AC-004-1: Soft delete (record vẫn tồn tại trong DB nhưng có `deleted_at`)
- [x] AC-004-2: Hỗ trợ bulk delete nhiều record cùng lúc
- [x] AC-004-3: Record đã xóa không xuất hiện trong danh sách mặc định

### US-005: Thay đổi trạng thái

**As a** `admin`
**I want to** bật/tắt trạng thái ngôn ngữ nhanh không cần vào form edit
**So that** tôi có thể quản lý nhanh hơn

#### Acceptance Criteria:
- [x] AC-005-1: Endpoint `POST /api/v1/language/change-status` nhận `id` và `publish`
- [x] AC-005-2: Trả về record đã cập nhật

---

## 4. Edge Cases & Constraints

| Case | Expected Behavior |
|------|-------------------|
| Gọi API khi chưa login | `401 Unauthenticated` |
| `canonical` trùng với record khác | Hiện tại chưa validate unique (TODO phase 2) |
| Upload file không phải ảnh | `422` với message "Ảnh đại diện phải là tệp hình ảnh" |
| Upload ảnh > 2MB | `422` với message lỗi kích thước |
| `id` không tồn tại trong show/update/destroy | `404` hoặc `500` từ BaseService |
| Bulk destroy với array IDs rỗng | `422` validation error |

---

## 5. Phụ thuộc (Dependencies)

- Depends on: `User` model (quan hệ creators)
- Blocks: Tích hợp content translation đa ngôn ngữ

---

## 6. Approval

- [x] **Dev Lead approved**
- [x] **Sẵn sàng để AI tạo Design**
