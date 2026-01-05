# 🔧 Troubleshooting Automation Tests

## Lỗi thường gặp và cách khắc phục

### 1. Browser không hiển thị

**Triệu chứng:**
- Test chạy nhưng không thấy browser window
- Test bị dừng ở bước "Đang tạo WebDriver instance..."

**Cách khắc phục:**

```powershell
# 1. Kiểm tra Chrome đã được cài đặt
Get-Command chrome

# 2. Kiểm tra Chrome version
chrome --version

# 3. Kiểm tra chromedriver
npx chromedriver --version

# 4. Cài đặt lại chromedriver nếu cần
cd C:\Users\OS\Duan-tLam\test-hrmSOA
npm install chromedriver --save-dev

# 5. Thử chạy với headless mode
$env:HEADLESS = "true"
npm run test:frontend
```

### 2. Timeout khi khởi động browser

**Triệu chứng:**
- Test bị timeout sau 30 giây
- Lỗi: "Timeout: Không thể khởi động browser sau 30 giây"

**Cách khắc phục:**

1. **Kiểm tra Chrome có đang chạy không:**
```powershell
Get-Process chrome -ErrorAction SilentlyContinue
# Nếu có, đóng tất cả Chrome windows
Stop-Process -Name chrome -Force
```

2. **Kiểm tra port 9515 (chromedriver port):**
```powershell
netstat -ano | findstr :9515
# Nếu có process đang dùng, kill nó
```

3. **Cài đặt lại chromedriver:**
```powershell
npm uninstall chromedriver
npm install chromedriver --save-dev
```

### 3. Lỗi "Cannot find module 'selenium-webdriver'"

**Cách khắc phục:**
```powershell
cd C:\Users\OS\Duan-tLam\test-hrmSOA
npm install
```

### 4. Backend services không chạy

**Triệu chứng:**
- Warning: "Backend server có thể không chạy"
- Tests fail với lỗi connection

**Cách khắc phục:**

```powershell
# 1. Khởi động MongoDB
# (Nếu dùng MongoDB service)
net start MongoDB

# 2. Khởi động các services
cd C:\Users\OS\Duan-tLam\backend-hrmSOA\services\identity-service
npm start

cd C:\Users\OS\Duan-tLam\backend-hrmSOA\services\admin-hr-service
npm start

cd C:\Users\OS\Duan-tLam\backend-hrmSOA\gateway
npm start

# 3. Hoặc dùng script tự động
cd C:\Users\OS\Duan-tLam\test-hrmSOA
.\start-services-and-test.ps1
```

### 5. Frontend server không chạy

**Triệu chứng:**
- Tests fail với lỗi "Cannot reach http://localhost:5173"

**Cách khắc phục:**

```powershell
# Khởi động frontend server
cd C:\Users\OS\Duan-tLam\frontend-hrmSOA
npm run dev
```

### 6. Tests chạy quá chậm

**Cách khắc phục:**

1. **Chạy với headless mode:**
```powershell
$env:HEADLESS = "true"
npm run test:frontend
```

2. **Tăng timeout trong test files:**
Sửa `TIMEOUT` constant trong các file test

### 7. Lỗi "options.setExcludeSwitches is not a function"

**Đã được sửa:** Sử dụng `options.addArguments('--exclude-switches=enable-automation')` thay vì `setExcludeSwitches()`

### 8. Browser hiển thị nhưng test fail

**Kiểm tra:**
1. Frontend server đang chạy ở đúng port (5173)
2. Backend services đang chạy
3. MongoDB đang chạy
4. Kiểm tra console logs trong browser để xem lỗi JavaScript

### 9. Windows-specific issues

**Nếu gặp lỗi với PowerShell:**

```powershell
# Thử dùng cmd thay vì PowerShell
cmd /c "cd C:\Users\OS\Duan-tLam\test-hrmSOA && npm run test:frontend"
```

**Nếu gặp lỗi với đường dẫn:**

```powershell
# Sử dụng đường dẫn đầy đủ
cd "C:\Users\OS\Duan-tLam\test-hrmSOA"
```

## 📞 Liên hệ

Nếu vẫn gặp vấn đề, hãy:
1. Chạy `npm run test:browser` để test browser riêng
2. Kiểm tra logs chi tiết
3. Chụp screenshot lỗi
4. Ghi lại các bước đã thử

