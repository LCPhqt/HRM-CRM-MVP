# 📖 Hướng dẫn Chạy Test bằng Node.js

## 🚀 Cách chạy nhanh nhất

### 1. Chạy Backend Unit Tests (Jest)

```powershell
cd C:\Users\OS\Duan-tLam\test-hrmSOA\backend\identity-service
npm test
```

Hoặc từ thư mục gốc:
```powershell
cd C:\Users\OS\Duan-tLam\test-hrmSOA
npm run test:backend
```

### 2. Chạy Frontend UI Tests (Selenium)

#### Test Login/Register:
```powershell
cd C:\Users\OS\Duan-tLam\test-hrmSOA
node frontend/ui/run-tests.js
```

#### Test Admin Search & Filter:
```powershell
cd C:\Users\OS\Duan-tLam\test-hrmSOA
node frontend/ui/admin-search-filter.test.js
```

### 3. Chạy tất cả UI Tests:
```powershell
cd C:\Users\OS\Duan-tLam\test-hrmSOA
npm run test:all-ui
```

## 🔧 Các tùy chọn khi chạy test

### Chạy với Browser hiển thị (mặc định):
```powershell
# Đảm bảo HEADLESS không được set
$env:HEADLESS = $null

# Chạy test
node frontend/ui/run-tests.js
```

### Chạy ở chế độ Headless (không hiển thị browser):
```powershell
$env:HEADLESS = "true"
node frontend/ui/run-tests.js
```

### Chạy với Frontend URL khác:
```powershell
$env:TEST_BASE_URL = "http://localhost:3000"
node frontend/ui/run-tests.js
```

### Chạy với Gateway URL khác:
```powershell
$env:TEST_GATEWAY_URL = "http://127.0.0.1:4000"
node frontend/ui/run-tests.js
```

### Chạy với test user khác:
```powershell
$env:TEST_USER_EMAIL = "user@example.com"
$env:TEST_USER_PASSWORD = "password123"
$env:TEST_ADMIN_EMAIL = "admin@example.com"
$env:TEST_ADMIN_PASSWORD = "admin123"
node frontend/ui/run-tests.js
```

## 📋 Danh sách các test case

### Backend Tests (`backend/identity-service/__tests__/authController.test.js`):

1. ✅ POST /api/auth/register - should register new user with valid data
2. ✅ POST /api/auth/register - should return 400 for missing email
3. ✅ POST /api/auth/register - should return 400 for missing password
4. ✅ POST /api/auth/register - should return 400 for invalid email format
5. ✅ POST /api/auth/register - should return 400 for short password
6. ✅ POST /api/auth/register - should return 409 for duplicate email
7. ✅ POST /api/auth/login - should login with valid credentials
8. ✅ POST /api/auth/login - should return 401 for wrong password
9. ✅ POST /api/auth/login - should return 401 for non-existent email

### Frontend UI Tests - Login/Register (`frontend/ui/run-tests.js`):

1. ✅ should open registration form at correct URL
2. ✅ should register new user and navigate to login
3. ✅ should login successfully with valid credentials
4. ✅ should show error on login with wrong password
5. ✅ should show error on login with non-existent email
6. ✅ should validate password length on registration

### Frontend UI Tests - Admin Search & Filter (`frontend/ui/admin-search-filter.test.js`):

1. ✅ should search employees by name
2. ✅ should search employees by email
3. ✅ should filter by status (all options)
4. ✅ should filter by status "Đang làm việc"
5. ✅ should filter by status "Nghỉ phép"
6. ✅ should filter by status "Đã nghỉ việc"
7. ✅ should combine search and filter
8. ✅ should show no results message when search has no matches

## 🎯 Ví dụ chạy test cụ thể

### Chạy chỉ Backend tests:
```powershell
cd C:\Users\OS\Duan-tLam\test-hrmSOA\backend\identity-service
npm test
```

### Chạy chỉ Frontend Login/Register tests:
```powershell
cd C:\Users\OS\Duan-tLam\test-hrmSOA
$env:HEADLESS = $null
node frontend/ui/run-tests.js
```

### Chạy chỉ Admin Search & Filter tests:
```powershell
cd C:\Users\OS\Duan-tLam\test-hrmSOA
$env:HEADLESS = $null
node frontend/ui/admin-search-filter.test.js
```

### Chạy test visual để kiểm tra browser:
```powershell
cd C:\Users\OS\Duan-tLam\test-hrmSOA
$env:HEADLESS = $null
npm run test:visual
```

## ⚙️ Cấu hình mặc định

### Environment Variables mặc định:

- `TEST_BASE_URL`: `http://localhost:5173` (Frontend URL)
- `TEST_GATEWAY_URL`: `http://127.0.0.1:4000` (Gateway URL)
- `TEST_USER_EMAIL`: `admin@gmail.com`
- `TEST_USER_PASSWORD`: `admin123`
- `TEST_ADMIN_EMAIL`: `admin@gmail.com`
- `TEST_ADMIN_PASSWORD`: `admin123`
- `HEADLESS`: `null` (Browser sẽ hiển thị)

## 📝 Lưu ý quan trọng

### Trước khi chạy UI Tests:

1. **Đảm bảo Frontend server đang chạy:**
   ```powershell
   cd C:\Users\OS\Duan-tLam\frontend-hrmSOA
   npm run dev
   ```

2. **Đảm bảo Backend services đang chạy:**
   - Gateway: `http://localhost:4000`
   - Identity Service: `http://localhost:5001`
   - Admin HR Service: `http://localhost:5003`
   - MongoDB: đang chạy

3. **Đảm bảo Chrome đã được cài đặt**

### Khi chạy test:

- Browser sẽ tự động mở (trừ khi `HEADLESS=true`)
- Test sẽ tự động thực hiện các thao tác
- Kết quả sẽ hiển thị trong console
- Nếu test fail, browser sẽ dừng lại để bạn quan sát lỗi

## 🐛 Troubleshooting

### Test không chạy được:

1. Kiểm tra dependencies:
   ```powershell
   cd C:\Users\OS\Duan-tLam\test-hrmSOA
   npm install
   cd backend/identity-service
   npm install
   ```

2. Kiểm tra services đang chạy:
   ```powershell
   # Kiểm tra Gateway
   curl http://localhost:4000/health
   
   # Kiểm tra Frontend
   curl http://localhost:5173
   ```

3. Xem file `CHECK_BROWSER.md` nếu browser không hiển thị

4. Xem file `TROUBLESHOOTING.md` để biết thêm cách khắc phục

## 📊 Xem kết quả test

### Backend Tests:
- Kết quả hiển thị trong console
- Coverage report: `backend/identity-service/coverage/`

### Frontend Tests:
- Kết quả hiển thị trong console
- Browser sẽ hiển thị quá trình test (nếu không headless)
- Tổng số test passed/failed sẽ hiển thị ở cuối

## 🎉 Hoàn thành!

Bây giờ bạn đã biết cách chạy tất cả các test cases bằng Node.js!

