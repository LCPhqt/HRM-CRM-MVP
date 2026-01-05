# 🔍 Kiểm tra Browser khi chạy Automation Test

## Vấn đề: Browser không hiển thị khi chạy test

### Bước 1: Kiểm tra HEADLESS environment variable

```powershell
# Kiểm tra HEADLESS có được set không
$env:HEADLESS

# Nếu có giá trị, xóa nó
$env:HEADLESS = $null

# Hoặc unset
Remove-Item Env:HEADLESS -ErrorAction SilentlyContinue
```

### Bước 2: Chạy test visual để kiểm tra browser

```powershell
cd C:\Users\OS\Duan-tLam\test-hrmSOA
$env:HEADLESS = $null
npm run test:visual
```

Test này sẽ:
- Mở browser và hiển thị Google.com
- Đợi 15 giây để bạn quan sát
- Cho bạn biết browser có hiển thị không

### Bước 3: Kiểm tra Chrome process

```powershell
# Kiểm tra xem có Chrome đang chạy không
Get-Process chrome -ErrorAction SilentlyContinue

# Xem chi tiết
Get-Process chrome -ErrorAction SilentlyContinue | Select-Object Id, ProcessName, MainWindowTitle
```

Nếu có process Chrome nhưng không thấy window:
- Browser có thể bị ẩn sau các cửa sổ khác
- Thử Alt+Tab để tìm browser window
- Thử Win+Tab để xem tất cả windows

### Bước 4: Chạy test với log chi tiết

```powershell
cd C:\Users\OS\Duan-tLam\test-hrmSOA
$env:HEADLESS = $null
node frontend/ui/run-tests.js
```

Quan sát output:
- `👀 Browser sẽ hiển thị` - Browser sẽ mở
- `✅ Browser đã khởi động!` - Browser đã được tạo
- `📱 Browser window sẽ hiển thị trong vài giây...` - Đang đợi browser hiển thị
- `✅ Browser đã sẵn sàng!` - Browser đã sẵn sàng

### Bước 5: Kiểm tra Chrome có được cài đặt đúng không

```powershell
# Kiểm tra Chrome
Get-Command chrome -ErrorAction SilentlyContinue

# Kiểm tra Chrome version
chrome --version

# Kiểm tra chromedriver
npx chromedriver --version
```

### Bước 6: Thử chạy trong CMD thay vì PowerShell

Đôi khi PowerShell có thể gây vấn đề. Thử chạy trong CMD:

```cmd
cd C:\Users\OS\Duan-tLam\test-hrmSOA
set HEADLESS=
node frontend/ui/run-tests.js
```

### Bước 7: Kiểm tra Windows Display Settings

- Đảm bảo không có multiple displays đang ẩn browser
- Kiểm tra Taskbar xem có Chrome icon không
- Thử minimize tất cả windows và xem browser có ở đâu không

## ✅ Nếu browser vẫn không hiển thị

1. **Thử chạy test-simple.js** (đã chạy thành công):
   ```powershell
   node frontend/ui/test-simple.js
   ```

2. **Kiểm tra Chrome có bị block bởi antivirus không**

3. **Thử cài đặt lại chromedriver**:
   ```powershell
   cd C:\Users\OS\Duan-tLam\test-hrmSOA
   npm uninstall chromedriver
   npm install chromedriver --save-dev
   ```

4. **Thử chạy với headless mode** để xem test có chạy được không:
   ```powershell
   $env:HEADLESS = "true"
   node frontend/ui/run-tests.js
   ```

## 📝 Lưu ý

- Browser có thể mở ở background hoặc bị ẩn
- Thử Alt+Tab hoặc Win+Tab để tìm browser window
- Kiểm tra Task Manager xem có process chrome.exe không
- Đảm bảo HEADLESS không được set

