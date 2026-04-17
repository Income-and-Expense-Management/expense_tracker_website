# Hướng dẫn Tích hợp Frontend & Phát triển Giao diện (Frontend Integration Guide)

> **Mục đích tài liệu:** Tài liệu này được biên soạn dành cho Frontend Developer và bất kỳ AI Agent nào khi tham gia xây dựng hoặc bảo trì ứng dụng (Web/Mobile App). Tài liệu trích xuất cấu trúc và hành vi của Backend API (ứng dụng QLCT_Server), giúp đảm bảo quá trình thiết kế giao diện (UI) và logic gọi API, xử lý dữ liệu được chính xác, giảm thiểu sai sót. 

---

## 1. Cấu trúc Response & Quản lý HTTP Status Code của Backend

Frontend cần bọc các hàm gọi API (như xử lý interceptor bằng Axios/Fetch) để xử lý tập trung định dạng chuẩn hóa sau của backend.

### Trạng thái Thành công (Success / Lấy dữ liệu hoặc Update)
**HTTP 200 (OK)** hoặc **201 (Created)**: Backend luôn trả về một object theo format cố định:
```json
{
  "success": true,
  "message": "Thông báo thành công",
  "data": { ... } // Có thể là một Đối tượng hoặc Mảng dựa trên Endpoint lấy về
}
```

### Xử lý Phân trang (Pagination)
Với các Endpoint lấy danh sách dài, Backend chèn thêm key `pagination`. Frontend/AI có thể dùng key này để làm Component phân trang (Paginator).
```json
{
  "success": true,
  "message": "Success",
  "data": [ ... ],
  "pagination": { "page": 1, "limit": 20, "total": 100, "totalPages": 5 }
}
```

### Xóa Dữ liệu (Delete) -> QUAN TRỌNG
**HTTP 204 No Content:** Backend hoàn toàn KHÔNG trả về JSON string. 
> ⚠️ **Quy tắc cho UI/Logic AI:** Không sử dụng hàm lệnh `.json()` trong fetch response hoặc parse body khi gặp HTTP 204. Chỉ cần bắt sự kiện nếu status mã `204` => Cập nhật lại state danh sách frontend.

### Bắt lỗi (Error) và Validation
- **400 (Bad Request - Lỗi định dạng nhập):** Trả về mảng các dòng lỗi `errors`.
```json
{
  "success": false,
  "message": "Dữ liệu không hợp lệ",
  "errors": [
    { "field": "name", "message": "Tên ví là bắt buộc" }
  ]
}
```
> **UI Rule:** Form Submit trên client nên parse mảng `errors` này theo tên `field` và highlight input bị sai đi kèm message lên dòng cảnh báo đổ đỏ. (Ví dụ: `formState.errors[field] = message`).

- **401 Unauthorized:** JWT token không gửi or hết hạn -> Điều hướng người dùng ra màn hình `/login`.
- **403 Forbidden:** Không có chủ quyền thao tác lên tài nguyên -> Xóa hành động, hiện cảnh báo popup.
- **404 Not Found:** Dữ liệu tìm kiếm không tồn tại trên hệ thống.
- **500 Server Error:** Lỗi chưa định dạng ở server -> Có thể báo cho người dùng "Lọc hệ thống".

---

## 2. Loại Dữ liệu Giao tiếp (Data Type Constraints)

| Domain/Trường dữ liệu | Từ Frontend Gửi Lên (Request Payload) | Từ Backend Gửi Về Giao diện (Response JSON) |
|---|---|---|
| **Dữ Liệu Tiền (Amount, initial_balance, ...)** | Định dạng **Number nguyên thủy JS** (hoặc parse string ra float). Backend dùng Zod Middleware tự ép qua. (Ví dụ: `{"amount": 50000}`) | Chuỗi **String**. Backend sử dụng `BigInt` để lưu giá trị dòng tiền cao (vnd) và serialize ra chuỗi qua json để tránh rớt số. Frontend phải sử dụng lib, ép số hoặc dùng BigInt JS để tính toán UI, tránh bị parse số sai! |
| **Loại Giao dịch / Danh mục (Type)** | Chỉ duy nhất Enum chuỗi: `'income'` (Thu) hoặc `'expense'` (Chi). | `'income'` | `'expense'` | 
| **Giá trị ID khóa chính** | UUID String (`"550e8400-e29b-41d4-a716-446655440000"`) | UUID String | 
| **Tiền tệ (Currency)** | String, mặc định: `'VND'` | `'VND'` (hoặc custom) |

---

## 3. Kiến trúc Auth và Trạng thái Toàn cục (Global State)

1. **Kiểu Đăng nhập:** Hệ thống cung cấp Login chuẩn `(email, password)` và OAuth qua Google Authentication (`post idToken`).
2. **Quản trị Token (JWT):** Token sẽ lấy từ backend qua `response.data.token`. Frontend cần lưu `token` này trong LocalStorage/Zustand State, sau đó đính vào trong Authentication Header dưới mẫu: `Authorization: "Bearer <token_here>"` ở toàn bộ các endpoint bảo vệ (suy ra là MỌI endpoint trừ auth/login/register).
3. **Fetching Profile:** Khởi động App, App chỉ nên kiểm tra JWT token. Gọi `GET /api/v1/auth/profile`. Nếu HTTP `200` => lấy global state profile xuống Redux/Context (userId, avatar_url, ...). Nếu `401` => reset LocalStorage và Redirect tới `/login`.

---

## 4. UI/UX Modeling Feature - Cấu trúc Các Screen/Components

AI cần dựa vào dữ liệu trả về để tạo cấu trúc màn hình/Trang tương ứng:

### 4.1. Ví điện tử (Wallets)
- **Kiến trúc DB:** Có ví, thuộc 1 user. Chứa các giao dịch làm tăng/giảm số dư. Ngôn ngữ backend sẽ *tự động tính và trả về* một trường đặc biệt dựa trên `Ví`.
- **UI & Logic:**
  - Component "Thẻ Ví / Tổng quan số dư": Khi lấy `/api/v1/wallets`, field `current_balance` đã được backend tính ra và attach trả về (trên logic: `initial_balance + thu - chi`). Không cần Client tự filter sum amount nữa.
  - Form Thêm Ví: Tạo form nhập (Tên ví `name`, Tiền lúc ban đầu `initial_balance` [number], có thể gán `icon_id`). 
  - Thao tác Xóa ví sẽ là xoá mềm (tức ví không bị truy kích chết khỏi DB mà chỉ ẩn ẩn đi).

### 4.2. Giao dịch (Transactions)
- **Kiến trúc DB:** Gắn liền với Ví (`wallet_id`). Có thể có danh mục hoặc không. Bắt buộc có loại `'income'|'expense'`.
- **UI & Logic:**
  - **Màn hình Danh sách/Sổ tay Giao dịch:** Design dạng list hoặc bảng, chia nhóm theo các ngày trong tháng.
  - **Dữ liệu Biểu đồ (Statistics Dashboard):** Backend có Endpoint `GET /wallets/:walletId/transactions/statistics` -> Sẵn sàng sử dụng output này để render chart Bar/Pie/Line Chart thống kê.
  - **Form Thêm Giao dịch:**
    - Cần state lưu loại GD: Thu hay Chi (`type`).
    - Số tiền (`amount`). Cần làm custom money-input mask cho số lượng vnđ cao.
    - Component Ngày lập (`transaction_date`), cần input date picker.
    - Modal dropdown để Chọn Ví, và Gọi List Select Chọn Danh Mục. 

### 4.3. Danh mục (Categories)
- **Kiến trúc DB:** Phân quyền riêng cho User (User có quyền tạo danh sách riêng biệt). Các danh mục phải là `'income'` hoặc `'expense'`.
- **UI & Logic:**
  - Giao diện dạng 2 Tab (Danh mục Thu | Danh mục Chi).
  - Có icon đi kèm. Tức phải triển khai màn hình picker chứa icon template string `icon_name`. 

### 4.4. Ngân sách Cố định (Budgets)
- **Kiến trúc DB:** Dùng để set target chi tiêu cho một User đối với nhóm Ví ở nhóm Category chỉ định (trong kì tg Start-End). Hệ thống Backend tính tự động `total_spent` và `remaining`.
- **UI & Logic:**
  - UI yêu cầu hiển thị "Thanh tiến độ (Progress Bar)". Tỉ lệ `(total_spent / target_amount * 100)%`.
  - Phân màu (Ví dụ: Thấp hơn 60% xanh, > 80% cam, > 100% đỏ vỡ ngân sách). Backend đã cung cấp data này, chỉ việc design UI hiển thị.

---

## 5. Danh mục Endpoints Tham khảo cho Fetching List (Axios/Api.ts)

AI tham chiếu vào sitemap này để trỏ URI fetching cho dự án Frontend, với **Base URL:** `[YOUR_FRONTEND_ENV_API_URL]/api/v1`

| Context Area | Endpoints Cấu Hình Frontend Cần Viết | Payload Yêu cầu Chính (Body/Params) |
|---|---|---|
| **Auth** | `POST /auth/register`<br>`POST /auth/login`<br>`POST /auth/google`<br>`GET /auth/profile` *(Bearer)* <br>`PATCH /auth/profile`<br>`PATCH /auth/change-password`<br>`POST /auth/logout` | Đăng ký: `{email, password, full_name}` <br>Đăng nhập: `{email, password}`<br>Google: `{idToken}` |
| **Wallets** | `GET /wallets`<br>`GET /wallets/:walletId`<br>`POST /wallets`<br>`PATCH /wallets/:walletId`<br>`DELETE /wallets/:walletId` *(204 HTTP)* | POST: `{name, initial_balance, currency, icon_id}`<br>PATCH: Cập nhật properties được chọn |
| **Transactions<br>(Chung - User wide)** | `GET /transactions`<br>`POST /transactions`<br>`GET /transactions/:id`<br>`PATCH /transactions/:id`<br>`DELETE /transactions/:id` *(204 HTTP)* | POST: Bắt buộc đính kèm `{wallet_id}` trong payload.<br>`{amount, type, transaction_date, note, category_id?, icon_id?}` |
| **Transactions<br>(Theo Wallet)** | `GET /wallets/:walletId/transactions`<br>`POST /wallets/:walletId/transactions`<br>`GET /wallets/:walletId/transactions/statistics` | POST: Không cần `wallet_id` (lấy từ params).<br>`{amount, type, transaction_date, note}` |
| **Categories** | `GET /categories`<br>`POST /categories`<br>`GET /categories/:id`<br>`PATCH /categories/:id`<br>`DELETE /categories/:id` *(204 HTTP)* | POST: `{name, type, icon_name}`<br>Type: `'income'` hoặc `'expense'` |
| **Budgets** | `GET /budgets`<br>`POST /budgets`<br>`GET /budgets/:id`<br>`PATCH /budgets/:id`<br>`DELETE /budgets/:id` *(204 HTTP)* | POST: `{wallet_id, category_id, target_amount, start_date, end_date}` |

> 🏷️ **Tóm tắt Công việc Frontend AI Integration:** Khi khởi tạo dự án Frontend (Ví dụ Next.js, React Native, Vite): Hãy ưu tiên thiết lập File `constants.ts` và interceptor `axios` tuân theo bộ HTTP Rules và Endpoint của tài liệu này đầu tiên. Sau đó triển khai kho quản lý Global Auth, rồi mới code các Router và Layouts! 
