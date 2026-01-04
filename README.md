## HRM + CRM (SOA) – Hướng dẫn chạy nhanh

### 1) Yêu cầu
- Node.js LTS (>= 16), npm
- MongoDB đang chạy `mongodb://127.0.0.1:27017`

### 2) Chuẩn bị mã nguồn
```bash
git clone <repo>
cd HRM-System_CKHV
```

### 3) Biến môi trường (tối thiểu)
- Mỗi service có file `env.example` (hoặc đã mô tả trong README riêng). Sao chép thành `.env`:
  - `backend-hrmSOA/services/identity-service/.env`  
    - `MONGO_URI=mongodb://127.0.0.1:27017/hrm_identity`
    - `ADMIN_EMAIL=admin@gmail.com`, `ADMIN_PASSWORD=admin123`
  - `backend-hrmSOA/services/profile-service/.env` (nếu có)
  - `backend-hrmSOA/services/admin-hr-service/.env` (nếu có)
  - `backend-hrmSOA/services/payroll-service/.env` (nếu có)
  - `backend-hrmSOA/services/department-service/.env` (nếu có)
  - `backend-hrmSOA/services/crm-service/.env`  
    - `MONGO_URL=mongodb://127.0.0.1:27017/hrm-crm` (đã chuẩn hóa 127.0.0.1 để tránh IPv6)
  - `backend-hrmSOA/gateway/.env`  
    - `GATEWAY_PORT=4000`
    - `IDENTITY_SERVICE_URL=http://localhost:5001`
    - `PROFILE_SERVICE_URL=http://localhost:5002`
    - `ADMIN_HR_SERVICE_URL=http://localhost:5003`
    - `PAYROLL_SERVICE_URL=http://localhost:5004`
    - `DEPARTMENT_SERVICE_URL=http://localhost:5006`
    - `CRM_SERVICE_URL=http://localhost:5007`
  - `frontend-hrmSOA/.env`  
    - `VITE_API_URL=http://localhost:4000`

> Mẹo: nếu thiếu biến, xem các README/`env.example` tương ứng trong từng thư mục service.

### 4) Cài phụ thuộc
```bash
# Gateway
cd backend-hrmSOA/gateway && npm install
# Các service (lặp lại cho từng service bạn cần)
cd ../services/identity-service && npm install
cd ../services/profile-service && npm install
cd ../services/admin-hr-service && npm install
cd ../services/payroll-service && npm install
cd ../services/department-service && npm install
cd ../services/crm-service && npm install
# Frontend
cd ../../../frontend-hrmSOA && npm install
```

### 5) Chạy backend
Mở nhiều terminal, mỗi terminal chạy một service:
```bash
# Identity (port 5001, auto seed admin)
cd backend-hrmSOA/services/identity-service
npm run dev

# Profile (port 5002)
cd backend-hrmSOA/services/profile-service
npm run dev

# Admin-HR (port 5003)
cd backend-hrmSOA/services/admin-hr-service
npm run dev

# Payroll (port 5004)
cd backend-hrmSOA/services/payroll-service
npm run dev

# Department (port 5006)
cd backend-hrmSOA/services/department-service
npm run dev

# CRM (port 5007)
cd backend-hrmSOA/services/crm-service
npm run dev
```

Sau đó chạy Gateway:
```bash
cd backend-hrmSOA/gateway
npm run dev   # lắng nghe port 4000, proxy các service
```

### 6) Chạy frontend
```bash
cd frontend-hrmSOA
npm run dev   # mặc định Vite port 5173
```
Truy cập: `http://localhost:5173`

### 7) Đăng nhập thử
- Admin mặc định: `admin@gmail.com` / `admin123` (được seed ở identity-service)
- Sau khi đăng nhập, frontend gọi qua gateway `http://localhost:4000`

### 8) CRM lưu ý nhanh
- CRM service: port 5007, Mongo `hrm-crm`.
- Nếu Mongo không sẵn sàng, service trả 503 thay vì crash; dùng `127.0.0.1` thay `localhost` để tránh lỗi IPv6 trên Windows.
- Frontend CRM:
  - Admin xem tất cả, gán “Người phụ trách” cho nhân viên.
  - Nhân viên chỉ thấy khách hàng của họ.
  - Import CSV/JSON tại trang CRM; có mẫu trong `backend-hrmSOA/services/crm-service/samples/`.
  - Xuất Excel: nút “⬇ Xuất Excel” (admin & staff).

### 9) Sự cố thường gặp
- 401 khi gọi CRM: kiểm tra token/đăng nhập lại; bảo đảm cùng JWT secret giữa services (gateway chỉ proxy).
- 504 từ gateway: kiểm tra service tương ứng có chạy (log gateway sẽ báo ECONNREFUSED).
- Mongo `ECONNREFUSED ::1`: đổi URI sang `127.0.0.1`.

### 10) Kiểm thử nhanh
- Đăng nhập admin -> truy cập CRM, Department, Payroll…
- Thêm khách hàng (admin/staff), kiểm tra đếm tổng và quyền xem.
- Import CSV mẫu và thử xuất Excel.

