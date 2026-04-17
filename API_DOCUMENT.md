# Tài liệu API - QLCT Server (Quản Lý Chi Tiêu)

## 📌 Cấu trúc trả về chuẩn (Standard Response Structure)
Mọi response từ server (kể cả thành công hay lỗi) đều đi qua file `utils/responseUtils.js` để đảm bảo format đồng nhất.

### 🟢 Thành công (200 OK / 201 Created)
```json
{
  "success": true,
  "message": "Thông báo thành công",
  "data": { ... } // Object hoặc Array chứa dữ liệu chính
}
```

### 🔴 Lỗi (400, 401, 403, 404, 409, 500)
```json
{
  "success": false,
  "message": "Tin nhắn mô tả lỗi (Ví dụ: Không tìm thấy, Không có quyền truy cập, ...)"
  // "errors": [] (Có thể xuất hiện nếu là lỗi validate form từ BadRequest middleware)
}
```

### 🟡 Không có nội dung (204 No Content)
Thường được dùng trong các API **DELETE**. API thực hiện thành công sẽ không trả về `body` hoặc trả rỗng, kèm theo mã HTTP `204`.

---

## 🔒 1. Authentication (Xác thực) - `/v1/auth`

| Phương thức | Route | Ý nghĩa | Status Code |
|---|---|---|---|
| **POST** | `/auth/register` | Đăng ký tài khoản nội bộ | `201 Created` |
| **POST** | `/auth/login` | Đăng nhập tài khoản nội bộ | `200 OK` |
| **POST** | `/auth/logout` | Đăng xuất (xóa token client) | `200 OK` |
| **GET** | `/auth/profile` | Lấy thông tin user hiện tại | `200 OK` |
| **PATCH** | `/auth/profile` | Cập nhật thông tin profile | `200 OK` |
| **PATCH** | `/auth/change-password` | Đổi mật khẩu | `200 OK` |
| **POST** | `/auth/google` | Đăng nhập với tài khoản Google | `200 OK` |

**Ví dụ trả về (`/auth/login`):**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "token": "eyJhbGciOiJIUz...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "Nguyen Van A",
      "avatar_url": "..."
    }
  }
}
```

---

## 👛 2. Wallets (Quản lý Ví) - `/v1/wallets`

| Phương thức | Route | Ý nghĩa | Status Code |
|---|---|---|---|
| **POST** | `/wallets` | Tạo ví mới | `201 Created` |
| **GET** | `/wallets` | Lấy danh sách ví của user | `200 OK` |
| **GET** | `/wallets/:walletId` | Lấy thông tin 1 ví cụ thể | `200 OK` |
| **PATCH** | `/wallets/:walletId` | Cập nhật ví (tên, số dư, icon,...) | `200 OK` |
| **DELETE**| `/wallets/:walletId` | Xóa ví (Soft-delete) | `204 No Content` |

**JSON Response trả về (Ví dụ cho GET `/wallets/:walletId`):**
```json
{
  "success": true,
  "message": "Lấy thông tin ví thành công",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Tiền mặt",
    "initial_balance": "10000000",
    "currency": "VND",
    "icon_id": "123e4567-e89b-12d3-a456-426614174001",
    "is_active": true
  }
}
```

---

## 💸 3. Transactions (Quản lý Giao dịch) - `/v1/transactions` & `/v1/wallets/:walletId/transactions`

| Phương thức | Route | Ý nghĩa | Status Code |
|---|---|---|---|
| **POST** | `/transactions` | Tạo giao dịch chung (cần gửi kèm `wallet_id`) | `201 Created` |
| **GET** | `/transactions` | Lấy danh sách giao dịch (hỗ trợ filter: `type`, `category_id`, `wallet_id`, `start_date`, `end_date`) | `200 OK` |
| **GET** | `/transactions/:transactionId` | Lấy chi tiết 1 giao dịch | `200 OK` |
| **PATCH** | `/transactions/:transactionId` | Chỉnh sửa nội dung giao dịch | `200 OK` |
| **DELETE**| `/transactions/:transactionId` | Xóa giao dịch (Hard-delete) | `204 No Content` |
| **GET** | `/wallets/:walletId/transactions` | Lấy danh sách giao dịch thuộc về **1 ví** cụ thể | `200 OK` |
| **GET** | `/wallets/:walletId/transactions/statistics` | Lấy thống kê của ví (thu/chi trong khoảng thời gian) | `200 OK` |
| **POST** | `/wallets/:walletId/transactions` | Tạo giao dịch cho một ví đã chọn | `201 Created` |

**JSON Response trả về (Ví dụ cho GET `/transactions/:transactionId`):**
```json
{
  "success": true,
  "message": "Lấy thông tin giao dịch thành công",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "wallet_id": "123e4567-e89b-12d3-a456-426614174001",
    "category_id": "123e4567-e89b-12d3-a456-426614174002",
    "amount": "500000",
    "type": "expense",
    "transaction_date": "2023-11-20T10:00:00.000Z",
    "icon_id": "123e4567-e89b-12d3-a456-426614174003",
    "note": "Ăn trưa"
  }
}
```

---

## 📑 4. Categories (Quản lý Danh mục) - `/v1/categories`

| Phương thức | Route | Ý nghĩa | Status Code |
|---|---|---|---|
| **POST** | `/categories` | Tạo danh mục mới | `201 Created` |
| **GET** | `/categories` | Lấy danh sách danh mục (hỗ trợ filter theo `type`: 'income' | 'expense') | `200 OK` |
| **GET** | `/categories/:categoryId` | Lấy chi tiết 1 danh mục | `200 OK` |
| **PATCH** | `/categories/:categoryId` | Cập nhật thông tin danh mục | `200 OK` |
| **DELETE**| `/categories/:categoryId` | Xóa danh mục (Hard-delete) | `204 No Content` |

**JSON Response trả về (Ví dụ cho GET `/categories/:categoryId`):**
```json
{
  "success": true,
  "message": "Lấy thông tin danh mục thành công",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Ăn uống",
    "type": "expense",
    "icon_name": "fa-burger"
  }
}
```

---

## 🎯 5. Budgets (Quản lý Ngân sách) - `/v1/budgets`

| Phương thức | Route | Ý nghĩa | Status Code |
|---|---|---|---|
| **POST** | `/budgets` | Tạo mục tiêu ngân sách | `201 Created` |
| **GET** | `/budgets` | Lấy tất cả ngân sách (có tùy chọn filter theo `wallet_id` và `category_id`) | `200 OK` |
| **GET** | `/budgets/:budgetId` | Lấy chi tiết ngân sách | `200 OK` |
| **PATCH** | `/budgets/:budgetId` | Cập nhật ngân sách | `200 OK` |
| **DELETE**| `/budgets/:budgetId` | Xóa mục tiêu ngân sách (Hard-delete) | `204 No Content` |

**JSON Response trả về (Ví dụ cho GET `/budgets/:budgetId`):**
```json
{
  "success": true,
  "message": "Lấy thông tin ngân sách thành công",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "wallet_id": "123e4567-e89b-12d3-a456-426614174001",
    "category_id": "123e4567-e89b-12d3-a456-426614174002",
    "target_amount": "5000000",
    "start_date": "2023-11-01T00:00:00.000Z",
    "end_date": "2023-11-30T23:59:59.000Z"
  }
}
```

> **Lưu ý:** Khớp với kiến trúc code, các trường tiền tệ (`amount`, `initial_balance`, `target_amount`) trả về dính kiểu `String` do được serialize từ `BigInt` (chống mất chính xác số thập phân). Enum loại giao dịch/danh mục sẽ là `'income'` hoặc `'expense'`.