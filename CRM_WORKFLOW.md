# CRM Module (Mở rộng từ HRM-System_CKHV) — Workflow triển khai an toàn

Tài liệu này mô tả cách **phát triển thêm CRM** (Customer Relationship Management) vào dự án HRM hiện tại theo hướng **mở rộng** (additive), đảm bảo **không ảnh hưởng** đến các chức năng HRM đang chạy.

---

## 1) Kiến trúc hiện tại (tóm tắt)

- **Frontend**: `frontend-hrmSOA` (React + Vite + Tailwind)
  - Auth lưu `token` / `role` trong localStorage, axios client dùng `VITE_API_BASE` (mặc định `http://localhost:4000`).
  - Route bảo vệ bằng `ProtectedRoute` (hiện check `role === requiredRole` nếu truyền `role`).

- **Backend**: `backend-hrmSOA`
  - **Gateway**: `backend-hrmSOA/gateway` (Express) chạy mặc định **4000** và proxy theo prefix:
    - `/auth`, `/users` → identity-service (5001)
    - `/profiles` → profile-service (5002)
    - `/admin` → admin-hr-service (5003)
    - `/payroll` → payroll-service (5004)
    - `/departments` → department-service (5006)
  - **Các service**: mỗi service là 1 Express app, đa số dùng MongoDB/Mongoose.

---

## 2) Mục tiêu CRM (MVP)

MVP đề xuất: **Quản lý khách hàng (Customers)** + CRUD cơ bản, đủ để mở rộng tiếp lên Contacts/Deals/Activities.

- `Customer`: name, email, phone, address, industry, status, tags, ownerId (tham chiếu user/employee).

**Nguyên tắc an toàn**:
- Chỉ thêm mới: service mới, route mới, page mới.
- Không sửa schema hiện tại của identity-service (tránh breaking change).
- Nếu CRM service chưa chạy, hệ thống HRM vẫn hoạt động bình thường; chỉ endpoint `/crm/*` mới bị lỗi (không ảnh hưởng endpoint khác).

---

## 3) Roadmap / workflow triển khai (khuyến nghị theo phase)

### Phase 0 — Chuẩn bị & nhánh làm việc
- Tạo branch: `feature/crm-mvp`
- Chốt phạm vi MVP: Customers CRUD.
- Thống nhất JWT secret dùng chung các service (`JWT_SECRET` / `ACCESS_TOKEN_SECRET`).

### Phase 1 — Backend: tạo `crm-service` (không chạm service cũ)
- Tạo folder: `backend-hrmSOA/services/crm-service`
- Port mặc định: **5007**
- Mongo DB mặc định: `mongodb://127.0.0.1:27017/hrm-crm` (tránh lỗi IPv6 `::1` trên Windows)
- Endpoints (MVP):
  - `GET /health`
  - `GET /crm/customers`
  - `GET /crm/customers/:id`
  - `POST /crm/customers` (tùy chính sách role)
  - `PUT /crm/customers/:id`
  - `DELETE /crm/customers/:id`
- Auth middleware: xác thực Bearer token (JWT) giống pattern các service hiện có.

### Phase 2 — Gateway: proxy CRM (mở rộng route)
- Thêm env: `CRM_SERVICE_URL` (default `http://localhost:5007`)
- Thêm proxy: `app.use('/crm', proxyWithBody(CRM_SERVICE_URL))`

### Phase 3 — Frontend: route + trang CRM (defensive)
- Thêm route `/crm` trong `src/App.jsx` (đặt ProtectedRoute phù hợp).
- Thêm menu “CRM” vào sidebar admin.
- Trang CRM nên:
  - Có thể load danh sách customers qua `GET /crm/customers`
  - Nếu lỗi (CRM service chưa chạy) → hiển thị thông báo thân thiện, **không crash UI**.

### Phase 3.1 — Staff: quản lý khách hàng của mình (owner-based)
- Thêm route: `GET/POST/PUT/DELETE /crm/customers` cho **staff** (giới hạn theo `ownerId = req.user.id`)
- Thêm trang frontend: `/staff/customers` + menu trong `StaffSidebar`
- Staff import: `POST /crm/customers/import` (mọi record tự gán `ownerId = req.user.id`)

### Phase 4 — Mở rộng tiếp theo (sau MVP)
1) `contacts` (liên hệ) dưới customer
2) `deals` + `pipeline_stages` (kanban)
3) `activities` + nhắc việc
4) RBAC chi tiết (nếu cần) — cân nhắc mở rộng identity-service sau cùng

---

## 4) Cách chạy (tham khảo)

### Gateway
```bash
cd backend-hrmSOA/gateway
npm i
npm run dev
```

### CRM Service
```bash
cd backend-hrmSOA/services/crm-service
npm i
npm run dev
```

### Frontend
```bash
cd frontend-hrmSOA
npm i
npm run dev
```

---

## 5) Checklist “không gây lỗi hệ thống hiện tại”
- [ ] Không chỉnh sửa route/behavior của `/auth`, `/users`, `/profiles`, `/admin`, `/payroll`, `/departments`
- [ ] Chỉ thêm mới `/crm/*` + service CRM
- [ ] Frontend CRM có xử lý lỗi API (try/catch, empty state)
- [ ] Build frontend không lỗi (import/route mới hợp lệ)
- [ ] Gateway vẫn chạy kể cả khi CRM service chưa chạy


