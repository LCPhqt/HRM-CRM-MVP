# Hướng Dẫn Chạy Tests

## 🎯 Cách Chạy Test Backend

### Yêu cầu:
- Node.js 18+
- MongoDB đang chạy trên port 27017

### Cách 1: Chạy trực tiếp (Khuyến nghị)

```powershell
# Di chuyển vào thư mục test
cd test-hrmSOA\backend\identity-service

# Chạy test
npm test
```

### Cách 2: Chạy từ thư mục gốc

```powershell
# Từ thư mục test-hrmSOA
npm run test:backend
```

### Cách 3: Chạy với coverage

```powershell
cd test-hrmSOA\backend\identity-service
npm test
# Coverage report sẽ được tạo trong thư mục coverage/
```

---

## 🎯 Cách Chạy Test Frontend (UI Tests)

### Yêu cầu:
- Node.js 18+
- Chrome browser đã cài đặt
- Frontend server đang chạy

### Bước 1: Khởi động Frontend Server

```powershell
# Terminal 1 - Khởi động frontend
cd frontend-hrmSOA
npm run dev
```

### Bước 2: Chạy UI Tests

```powershell
# Terminal 2 - Chạy test
cd test-hrmSOA
npm run test:frontend    # Test Login/Register
npm run test:admin       # Test Admin Search & Filter
npm run test:all-ui      # Tất cả UI tests
```

---

## 🚀 Chạy Tất Cả Tests (Backend + Frontend)

### Sử dụng Script PowerShell (Tự động)

```powershell
cd test-hrmSOA
.\start-services-and-test.ps1
```

### Chạy riêng từng loại:

```powershell
# Chỉ Backend Tests
.\start-services-and-test.ps1 backend

# Chỉ Frontend UI Tests
.\start-services-and-test.ps1 frontend

# Chỉ Admin Tests
.\start-services-and-test.ps1 admin

# Tất cả UI Tests
.\start-services-and-test.ps1 all-ui
```

### Dừng services:

```powershell
.\stop-services.ps1
```

---

## 📋 Chạy Thủ Công (Nếu script không hoạt động)

### Backend Tests:

1. **Đảm bảo MongoDB đang chạy:**
   ```powershell
   # Kiểm tra MongoDB
   netstat -an | findstr :27017
   ```

2. **Chạy test:**
   ```powershell
   cd test-hrmSOA\backend\identity-service
   npm test
   ```

### Frontend Tests:

1. **Khởi động các services cần thiết:**
   ```powershell
   # Terminal 1 - Identity Service
   cd backend-hrmSOA\services\identity-service
   npm start
   
   # Terminal 2 - Admin HR Service
   cd backend-hrmSOA\services\admin-hr-service
   npm start
   
   # Terminal 3 - Gateway
   cd backend-hrmSOA\gateway
   npm start
   
   # Terminal 4 - Frontend
   cd frontend-hrmSOA
   npm run dev
   ```

2. **Chạy test:**
   ```powershell
   # Terminal 5
   cd test-hrmSOA
   npm run test:frontend
   ```

---

## 🔧 Troubleshooting

### Backend Tests Fail:

1. **Kiểm tra MongoDB:**
   ```powershell
   # Kiểm tra MongoDB có đang chạy không
   netstat -an | findstr :27017
   ```

2. **Kiểm tra biến môi trường:**
   ```powershell
   # Test sẽ tự động sử dụng:
   # TEST_MONGO_URI=mongodb://127.0.0.1:27017/hrm_identity_test
   # JWT_SECRET=test_secret
   ```

3. **Xóa node_modules và cài lại:**
   ```powershell
   cd test-hrmSOA\backend\identity-service
   rmdir /s /q node_modules
   npm install
   npm test
   ```

### Frontend Tests Fail:

1. **Đảm bảo tất cả services đã khởi động:**
   - Identity Service (port 5001)
   - Admin HR Service (port 5003)
   - Gateway (port 4000)
   - Frontend (port 5173 hoặc port khác)

2. **Kiểm tra Chrome:**
   - Đảm bảo Chrome đã được cài đặt
   - Test sẽ tự động tìm Chrome

3. **Chạy ở chế độ headless (không hiển thị browser):**
   ```powershell
   $env:HEADLESS = "true"
   npm run test:frontend
   ```

---

## 📊 Xem Kết Quả Test

### Backend Tests:
- Kết quả hiển thị trên console
- Coverage report: `test-hrmSOA/backend/identity-service/coverage/lcov-report/index.html`

### Frontend Tests:
- Kết quả hiển thị trên console
- Browser sẽ mở để quan sát (trừ khi HEADLESS=true)

---

## 🎯 Quick Start (Nhanh nhất)

```powershell
# 1. Chạy Backend Tests
cd test-hrmSOA\backend\identity-service
npm test

# 2. Hoặc chạy Frontend Tests (cần services đang chạy)
cd test-hrmSOA
npm run test:frontend
```

