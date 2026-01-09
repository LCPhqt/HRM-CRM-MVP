# 🏢 HRM-CRM Backend SOA

Hệ thống quản lý Nhân sự (HRM) và Khách hàng (CRM) theo kiến trúc **Service-Oriented Architecture**.

---

## 📦 Danh sách Services

| Service | Port | Mô tả | Swagger UI |
|---------|------|-------|------------|
| **Gateway** | 4000 | API Gateway (entry point) | http://localhost:4000/api-docs |
| **Identity Service** | 5001 | Xác thực & quản lý users | http://localhost:5001/api-docs |
| **Profile Service** | 5002 | Quản lý hồ sơ nhân viên | http://localhost:5002/api-docs |
| **Admin HR Service** | 5003 | Quản lý nhân viên (Admin) | http://localhost:5003/api-docs |
| **Payroll Service** | 5004 | Quản lý bảng lương | http://localhost:5004/api-docs |
| **Department Service** | 5006 | Quản lý phòng ban | http://localhost:5006/api-docs |
| **CRM Service** | 5007 | Quản lý khách hàng | http://localhost:5007/api-docs |

---

## 🚀 Hướng dẫn cài đặt

### Yêu cầu hệ thống

- **Node.js** >= 16.x
- **MongoDB** (local hoặc Atlas)
- **npm** hoặc **yarn**

### Bước 1: Cài đặt dependencies

Mở PowerShell và chạy từng lệnh:

```powershell
# Di chuyển đến thư mục backend
cd D:\_StudyCode\Thay_HoangViet\HRM-CRM-MVP\backend-SOA

# Cài đặt Gateway
cd gateway && npm install && cd ..

# Cài đặt Identity Service
cd services\identity-service && npm install && cd ..\..

# Cài đặt Profile Service
cd services\profile-service && npm install && cd ..\..

# Cài đặt Admin HR Service
cd services\admin-hr-service && npm install && cd ..\..

# Cài đặt Payroll Service
cd services\payroll-service && npm install && cd ..\..

# Cài đặt Department Service
cd services\department-service && npm install && cd ..\..

# Cài đặt CRM Service
cd services\crm-service && npm install && cd ..\..
```

### Bước 2: Khởi động MongoDB

Đảm bảo MongoDB đang chạy trên `localhost:27017` (hoặc `127.0.0.1:27017`).

### Bước 3: Khởi động các Services

Mở **7 terminal riêng biệt** và chạy từng service:

```powershell
# Terminal 1 - Identity Service
cd backend-SOA\services\identity-service
npm run dev

# Terminal 2 - Profile Service
cd backend-SOA\services\profile-service
npm run dev

# Terminal 3 - Admin HR Service
cd backend-SOA\services\admin-hr-service
npm run dev

# Terminal 4 - Payroll Service
cd backend-SOA\services\payroll-service
npm run dev

# Terminal 5 - Department Service
cd backend-SOA\services\department-service
npm run dev

# Terminal 6 - CRM Service
cd backend-SOA\services\crm-service
npm run dev

# Terminal 7 - Gateway
cd backend-SOA\gateway
npm run dev
```

---

## 🧪 Hướng dẫn Test API với Swagger

### Truy cập Swagger UI

Sau khi khởi động tất cả services, mở trình duyệt:

- **Test tất cả API qua Gateway:** http://localhost:4000/api-docs
- **Test từng service riêng:** Xem bảng ở trên

### Luồng Test cơ bản

#### 1️⃣ Đăng ký tài khoản (User đầu tiên sẽ là Admin)

1. Mở http://localhost:5001/api-docs (hoặc http://localhost:4000/api-docs)
2. Tìm **Auth** → **POST /auth/register**
3. Click **"Try it out"**
4. Nhập body:

```json
{
  "email": "admin@test.com",
  "password": "123456",
  "confirm_password": "123456",
  "full_name": "Admin Test"
}
```

5. Click **"Execute"**
6. Kiểm tra response 201 → Thành công!

#### 2️⃣ Đăng nhập lấy Token

1. Tìm **Auth** → **POST /auth/login**
2. Click **"Try it out"**
3. Nhập body:

```json
{
  "email": "admin@test.com",
  "password": "123456"
}
```

4. Click **"Execute"**
5. **Copy `accessToken`** từ response

#### 3️⃣ Authorize (Xác thực)

1. Click nút **🔓 Authorize** ở góc phải trên
2. Dán token vào ô **Value**
3. Click **"Authorize"** → **"Close"**

#### 4️⃣ Test các API khác

Sau khi authorize, bạn có thể test tất cả API:

| API | Mô tả |
|-----|-------|
| `GET /auth/me` | Xem thông tin user đang đăng nhập |
| `GET /profiles/me` | Xem profile của tôi |
| `PUT /profiles/me` | Cập nhật profile |
| `GET /departments` | Xem danh sách phòng ban |
| `POST /departments` | Tạo phòng ban (Admin) |
| `GET /crm/customers` | Xem khách hàng |
| `POST /crm/customers` | Tạo khách hàng |
| `GET /crm/customers/stats` | Thống kê khách hàng |
| `GET /payroll/runs` | Xem danh sách kỳ lương (Admin) |
| `GET /admin/employees` | Xem nhân viên (Admin) |

---

## 📋 Test Cases mẫu

### Test Identity Service

```
✅ Đăng ký user mới
✅ Đăng nhập với email/password đúng
✅ Đăng nhập với password sai → 401
✅ Lấy thông tin /auth/me với token
✅ Lấy /auth/me không có token → 401
```

### Test Profile Service

```
✅ Xem profile của tôi
✅ Cập nhật tên, phone, department
✅ Admin xem danh sách tất cả profiles
✅ Staff xem danh sách public profiles
```

### Test Department Service

```
✅ Xem danh sách phòng ban
✅ Admin tạo phòng ban mới
✅ Staff tạo phòng ban → 403 Forbidden
✅ Admin cập nhật/xóa phòng ban
```

### Test CRM Service

```
✅ Tạo khách hàng mới
✅ Xem danh sách khách hàng (Staff chỉ thấy của mình)
✅ Cập nhật thông tin khách hàng
✅ Xóa mềm khách hàng
✅ Admin xem tất cả khách hàng
✅ Admin khôi phục khách hàng đã xóa
✅ Import nhiều khách hàng
✅ Xem thống kê /stats
```

### Test Payroll Service (Admin only)

```
✅ Tạo kỳ lương mới (period: "2025-01")
✅ Thêm item lương cho nhân viên
✅ Tính lại lương (recalc)
✅ Xuất CSV bảng lương
```

---

## 🔐 Phân quyền

| Role | Quyền |
|------|-------|
| **Admin** | Toàn quyền: CRUD users, profiles, departments, payroll, employees, tất cả customers |
| **Staff** | Xem/sửa profile của mình, xem departments, CRUD customers của mình |

### Lưu ý:
- User **đầu tiên** đăng ký sẽ tự động là **Admin**
- Các user sau sẽ là **Staff**

---

## 🔧 Cấu hình Environment

Mỗi service có thể có file `.env` riêng:

### Identity Service (.env)
```
PORT=5001
MONGO_URL=mongodb://127.0.0.1:27017/hrm-identity
JWT_SECRET=your-secret-key
```

### Profile Service (.env)
```
PORT=5002
MONGO_URL=mongodb://127.0.0.1:27017/hrm-profile
JWT_SECRET=your-secret-key
```

### CRM Service (.env)
```
PORT=5007
MONGO_URL=mongodb://127.0.0.1:27017/hrm-crm
JWT_SECRET=your-secret-key
```

---

## 📁 Cấu trúc thư mục

```
backend-SOA/
├── gateway/                    # API Gateway (Port 4000)
│   ├── server.js
│   ├── swagger.js
│   └── package.json
│
└── services/
    ├── identity-service/       # Port 5001
    │   ├── server.js
    │   ├── swagger.js
    │   └── src/
    │       ├── controllers/
    │       ├── routes/
    │       ├── services/
    │       └── repositories/
    │
    ├── profile-service/        # Port 5002
    ├── admin-hr-service/       # Port 5003
    ├── payroll-service/        # Port 5004
    ├── department-service/     # Port 5006
    └── crm-service/            # Port 5007
```

---

## ❓ Troubleshooting

### Lỗi: Cannot find module 'swagger-jsdoc'

```powershell
cd <service-folder>
npm install swagger-jsdoc swagger-ui-express
```

### Lỗi: ECONNREFUSED 127.0.0.1:27017

MongoDB chưa chạy. Khởi động MongoDB:
```powershell
# Windows
net start MongoDB

# Hoặc chạy mongod trực tiếp
mongod
```

### Lỗi: Port already in use

Tắt process đang dùng port hoặc đổi port trong file `.env`.

### Swagger UI không hiển thị

1. Kiểm tra service đã chạy chưa
2. Truy cập đúng URL: `http://localhost:<port>/api-docs`
3. Clear cache trình duyệt

---

## 📞 API Endpoints Summary

### Auth (`/auth`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | /auth/register | Đăng ký |
| POST | /auth/login | Đăng nhập |
| GET | /auth/me | Thông tin user hiện tại |

### Users (`/users`) - Admin only
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | /users | Danh sách users |
| GET | /users/:id | Chi tiết user |
| PUT | /users/:id | Cập nhật user |
| DELETE | /users/:id | Xóa user |

### Profiles (`/profiles`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | /profiles/me | Profile của tôi |
| PUT | /profiles/me | Cập nhật profile |
| GET | /profiles/public | Danh sách public |
| GET | /profiles | Danh sách đầy đủ (Admin) |

### Departments (`/departments`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | /departments | Danh sách |
| POST | /departments | Tạo mới (Admin) |
| PUT | /departments/:id | Cập nhật (Admin) |
| DELETE | /departments/:id | Xóa (Admin) |

### Employees (`/admin/employees`) - Admin only
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | /admin/employees | Danh sách nhân viên |
| POST | /admin/employees | Tạo nhân viên |
| PUT | /admin/employees/:id | Cập nhật |
| DELETE | /admin/employees/:id | Xóa |

### Payroll (`/payroll`) - Admin only
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | /payroll/runs | Danh sách kỳ lương |
| POST | /payroll/runs | Tạo kỳ lương |
| GET | /payroll/runs/:id | Chi tiết (có items) |
| POST | /payroll/runs/:id/items | Thêm item |
| POST | /payroll/runs/:id/recalc | Tính lại |
| GET | /payroll/runs/:id/export | Xuất CSV |

### Customers (`/crm/customers`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | /crm/customers | Danh sách |
| POST | /crm/customers | Tạo mới |
| GET | /crm/customers/stats | Thống kê |
| GET | /crm/customers/count | Đếm |
| POST | /crm/customers/import | Import hàng loạt |
| GET | /crm/customers/:id | Chi tiết |
| PUT | /crm/customers/:id | Cập nhật |
| DELETE | /crm/customers/:id | Xóa mềm |
| GET | /crm/customers/:id/logs | Lịch sử |
| GET | /crm/customers/deleted | Đã xóa (Admin) |
| POST | /crm/customers/:id/restore | Khôi phục (Admin) |


