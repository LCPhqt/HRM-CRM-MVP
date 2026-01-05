# Test Cases - HRM SOA System

Tài liệu này chứa tất cả các test cases cho hệ thống HRM SOA, được tổ chức theo format bảng chuẩn.

---

## Mục 1: Backend Unit Tests (authController.test.js)

### 1.1. Registration API Tests

| TCID | Mô tả | Tiền điều kiện | Bước thực hiện | Dữ liệu kiểm thử | Kết quả mong đợi |
|------|-------|----------------|----------------|------------------|------------------|
| HRM-BACKEND-TC01 | Đăng ký thành công với dữ liệu hợp lệ | MongoDB đang chạy, test database sẵn sàng | 1. Gửi POST request đến `/auth/register` với dữ liệu hợp lệ<br>2. Kiểm tra response status và body<br>3. Kiểm tra user được tạo trong database | Email: `test@example.com`<br>Password: `password123`<br>Confirm Password: `password123`<br>Full Name: `Test User` | Status code: 201<br>Response có `accessToken`<br>Response có `role: 'staff'`<br>Response có `user` object với email đúng<br>User được tạo trong database với role 'staff' |
| HRM-BACKEND-TC02 | Trả về 400 khi thiếu email | MongoDB đang chạy, test database sẵn sàng | 1. Gửi POST request đến `/auth/register` không có email<br>2. Kiểm tra response | Password: `password123`<br>Confirm Password: `password123`<br>Full Name: `Test User` | Status code: 400<br>Response message: `"Email và mật khẩu là bắt buộc"` |
| HRM-BACKEND-TC03 | Trả về 400 khi thiếu password | MongoDB đang chạy, test database sẵn sàng | 1. Gửi POST request đến `/auth/register` không có password<br>2. Kiểm tra response | Email: `test@example.com`<br>Confirm Password: `password123`<br>Full Name: `Test User` | Status code: 400<br>Response message: `"Email và mật khẩu là bắt buộc"` |
| HRM-BACKEND-TC04 | Trả về 400 khi password và confirm_password không khớp | MongoDB đang chạy, test database sẵn sàng | 1. Gửi POST request đến `/auth/register` với password và confirm_password khác nhau<br>2. Kiểm tra response | Email: `test@example.com`<br>Password: `password123`<br>Confirm Password: `password456`<br>Full Name: `Test User` | Status code: 400<br>Response message: `"Mật khẩu nhập lại không khớp"` |
| HRM-BACKEND-TC05 | Trả về 409 khi email đã tồn tại | MongoDB đang chạy, user với email `existing@example.com` đã tồn tại trong database | 1. Tạo user với email `existing@example.com`<br>2. Gửi POST request đến `/auth/register` với email đã tồn tại<br>3. Kiểm tra response | Email: `existing@example.com`<br>Password: `password123`<br>Confirm Password: `password123`<br>Full Name: `Test User` | Status code: 409<br>Response message: `"Email already registered"` |
| HRM-BACKEND-TC06 | Hash password trước khi lưu vào database | MongoDB đang chạy, test database sẵn sàng | 1. Gửi POST request đến `/auth/register` với password<br>2. Kiểm tra user trong database<br>3. Verify password hash và có thể verify được | Email: `test@example.com`<br>Password: `password123`<br>Confirm Password: `password123`<br>Full Name: `Test User` | Status code: 201<br>Password trong database được hash (không phải plain text)<br>Hash có độ dài 60 ký tự (bcrypt)<br>Có thể verify password bằng bcrypt.compare |
| HRM-BACKEND-TC07 | Đăng ký thành công không cần full_name | MongoDB đang chạy, test database sẵn sàng | 1. Gửi POST request đến `/auth/register` không có full_name<br>2. Kiểm tra response | Email: `test@example.com`<br>Password: `password123`<br>Confirm Password: `password123` | Status code: 201<br>Response có `accessToken`<br>Đăng ký thành công |

### 1.2. Login API Tests

| TCID | Mô tả | Tiền điều kiện | Bước thực hiện | Dữ liệu kiểm thử | Kết quả mong đợi |
|------|-------|----------------|----------------|------------------|------------------|
| HRM-BACKEND-TC08 | Đăng nhập thành công với credentials đúng | MongoDB đang chạy, user với email `login@example.com` và password `password123` đã tồn tại | 1. Gửi POST request đến `/auth/login` với credentials đúng<br>2. Kiểm tra response | Email: `login@example.com`<br>Password: `password123` | Status code: 200<br>Response có `accessToken`<br>Response có `role: 'staff'` |
| HRM-BACKEND-TC09 | Trả về 400 khi thiếu email | MongoDB đang chạy, test database sẵn sàng | 1. Gửi POST request đến `/auth/login` không có email<br>2. Kiểm tra response | Password: `password123` | Status code: 400<br>Response message: `"Email and password required"` |
| HRM-BACKEND-TC10 | Trả về 400 khi thiếu password | MongoDB đang chạy, test database sẵn sàng | 1. Gửi POST request đến `/auth/login` không có password<br>2. Kiểm tra response | Email: `login@example.com` | Status code: 400<br>Response message: `"Email and password required"` |
| HRM-BACKEND-TC11 | Trả về 401 khi email không tồn tại | MongoDB đang chạy, test database sẵn sàng | 1. Gửi POST request đến `/auth/login` với email không tồn tại<br>2. Kiểm tra response | Email: `nonexistent@example.com`<br>Password: `password123` | Status code: 401<br>Response message: `"Invalid credentials"` |
| HRM-BACKEND-TC12 | Trả về 401 khi password sai | MongoDB đang chạy, user với email `login@example.com` đã tồn tại | 1. Gửi POST request đến `/auth/login` với password sai<br>2. Kiểm tra response | Email: `login@example.com`<br>Password: `wrongpassword` | Status code: 401<br>Response message: `"Invalid credentials"` |
| HRM-BACKEND-TC13 | Trả về JWT token hợp lệ khi đăng nhập thành công | MongoDB đang chạy, user với email `login@example.com` và password `password123` đã tồn tại | 1. Gửi POST request đến `/auth/login` với credentials đúng<br>2. Kiểm tra accessToken<br>3. Verify JWT token | Email: `login@example.com`<br>Password: `password123` | Status code: 200<br>Response có `accessToken` (không null/undefined)<br>JWT token có thể decode được<br>Token chứa `email: 'login@example.com'`<br>Token chứa `role: 'staff'` |

---

## Mục 2: Frontend UI Tests - Login/Register (run-tests.js)

| TCID | Mô tả | Tiền điều kiện | Bước thực hiện | Dữ liệu kiểm thử | Kết quả mong đợi |
|------|-------|----------------|----------------|------------------|------------------|
| HRM-UI-REGISTER-TC01 | Đăng ký user mới và đăng nhập thành công | Frontend server đang chạy, backend services đang chạy, Chrome browser sẵn sàng | 1. Truy cập trang `/register`<br>2. Điền form đăng ký với email và password mới<br>3. Nhấn nút "Đăng ký"<br>4. Sau khi đăng ký thành công, điền form đăng nhập<br>5. Nhấn nút "Đăng nhập" | Email: `test{timestamp}@example.com`<br>Password: `Test123456!`<br>Confirm Password: `Test123456!` | Đăng ký thành công và chuyển sang trang login<br>Đăng nhập thành công<br>Điều hướng đến trang `/home`, `/customers`, `/dashboard`, hoặc `/staff`<br>Không còn ở trang `/login` |
| HRM-UI-REGISTER-TC02 | Đăng ký thành công rồi đăng nhập lại | Frontend server đang chạy, backend services đang chạy, Chrome browser sẵn sàng | 1. Truy cập trang `/register`<br>2. Điền form đăng ký với email và password mới<br>3. Nhấn nút "Đăng ký"<br>4. Kiểm tra đã chuyển sang trang login<br>5. Điền form đăng nhập với tài khoản vừa tạo<br>6. Nhấn nút "Đăng nhập" | Email: `register{timestamp}@example.com`<br>Password: `Test123456!`<br>Confirm Password: `Test123456!` | Đăng ký thành công<br>Chuyển sang trang `/login`<br>Đăng nhập thành công<br>Điều hướng đến trang đúng (không còn ở `/login`) |
| HRM-UI-REGISTER-TC03 | Đăng ký rồi quay lại và đăng nhập thành công | Frontend server đang chạy, backend services đang chạy, Chrome browser sẵn sàng | 1. Truy cập trang `/register`<br>2. Điền form đăng ký với email và password mới<br>3. Nhấn nút "Đăng ký"<br>4. Sau khi chuyển sang login, điều hướng trực tiếp đến `/login`<br>5. Điền form đăng nhập với tài khoản vừa tạo<br>6. Nhấn nút "Đăng nhập" | Email: `backlogin{timestamp}@example.com`<br>Password: `Test123456!`<br>Confirm Password: `Test123456!` | Đăng ký thành công<br>Chuyển sang trang `/login`<br>Có thể điều hướng lại trang login<br>Đăng nhập thành công<br>Điều hướng đến trang đúng |
| HRM-UI-REGISTER-TC04 | Hiển thị lỗi khi đăng ký với email trùng | Frontend server đang chạy, backend services đang chạy, email `admin@gmail.com` đã tồn tại | 1. Truy cập trang `/register`<br>2. Điền form với email đã tồn tại<br>3. Nhấn nút "Đăng ký" | Email: `admin@gmail.com` (đã tồn tại)<br>Password: `NewPassword123!`<br>Confirm Password: `NewPassword123!` | Hiển thị thông báo lỗi về email đã tồn tại (chứa từ "tồn tại", "exists", hoặc "duplicate") |
| HRM-UI-REGISTER-TC05 | Hiển thị lỗi khi đăng ký với password không khớp | Frontend server đang chạy, backend services đang chạy, Chrome browser sẵn sàng | 1. Truy cập trang `/register`<br>2. Điền form với password và confirm password khác nhau<br>3. Nhấn nút "Đăng ký" | Email: `mismatch{timestamp}@example.com`<br>Password: `Password123!`<br>Confirm Password: `Mismatch123!` | Hiển thị thông báo lỗi về password không khớp (chứa từ "không khớp", "mismatch", hoặc "not match") |
| HRM-UI-REGISTER-TC06 | Validate độ dài password khi đăng ký | Frontend server đang chạy, backend services đang chạy, Chrome browser sẵn sàng | 1. Truy cập trang `/register`<br>2. Điền form với password quá ngắn<br>3. Nhấn nút "Đăng ký" | Email: `test@example.com`<br>Password: `short`<br>Confirm Password: `short` | Hiển thị validation error cho password ngắn<br>Hoặc vẫn ở trang `/register` (form validation) |
| HRM-UI-LOGIN-TC01 | Đăng nhập thành công với credentials hợp lệ | Frontend server đang chạy, backend services đang chạy, tài khoản admin tồn tại | 1. Truy cập trang `/login`<br>2. Điền email và password hợp lệ<br>3. Nhấn nút "Đăng nhập" | Email: `admin@gmail.com` (hoặc từ env `TEST_USER_EMAIL`)<br>Password: `admin123` (hoặc từ env `TEST_USER_PASSWORD`) | Đăng nhập thành công<br>Điều hướng đến trang `/home`, `/customers`, `/dashboard`, hoặc `/staff`<br>Không còn ở trang `/login` |
| HRM-UI-LOGIN-TC02 | Hiển thị lỗi khi đăng nhập với password sai | Frontend server đang chạy, backend services đang chạy, tài khoản admin tồn tại | 1. Truy cập trang `/login`<br>2. Điền email đúng và password sai<br>3. Nhấn nút "Đăng nhập" | Email: `admin@gmail.com`<br>Password: `wrongpassword123` | Hiển thị thông báo lỗi (chứa từ "sai", "wrong", hoặc "incorrect")<br>Vẫn ở trang `/login` |
| HRM-UI-LOGIN-TC03 | Hiển thị lỗi khi đăng nhập với email không tồn tại | Frontend server đang chạy, backend services đang chạy, Chrome browser sẵn sàng | 1. Truy cập trang `/login`<br>2. Điền email không tồn tại<br>3. Nhấn nút "Đăng nhập" | Email: `nonexistent@example.com`<br>Password: `password123` | Hiển thị thông báo lỗi (chứa từ "không", "not", hoặc "exist")<br>Vẫn ở trang `/login` |

---

## Mục 3: Frontend UI Tests - Admin Search & Filter (admin-search-filter.test.js)

| TCID | Mô tả | Tiền điều kiện | Bước thực hiện | Dữ liệu kiểm thử | Kết quả mong đợi |
|------|-------|----------------|----------------|------------------|------------------|
| HRM-UI-ADMIN-TC01 | Tìm kiếm nhân viên theo tên | Frontend server đang chạy, backend services đang chạy, đã đăng nhập với tài khoản admin, có ít nhất 1 nhân viên trong hệ thống | 1. Đăng nhập với tài khoản admin<br>2. Truy cập trang `/admin`<br>3. Lấy tên nhân viên đầu tiên<br>4. Nhập một phần tên vào ô tìm kiếm<br>5. Kiểm tra kết quả | Search text: 3 ký tự đầu của tên nhân viên | Kết quả tìm kiếm hiển thị nhân viên có tên chứa text tìm kiếm<br>Hoặc không có kết quả nếu không khớp |
| HRM-UI-ADMIN-TC02 | Tìm kiếm nhân viên theo email | Frontend server đang chạy, backend services đang chạy, đã đăng nhập với tài khoản admin, có ít nhất 1 nhân viên trong hệ thống | 1. Đăng nhập với tài khoản admin<br>2. Truy cập trang `/admin`<br>3. Lấy email nhân viên đầu tiên<br>4. Nhập phần email (trước @) vào ô tìm kiếm<br>5. Kiểm tra kết quả | Search text: phần email trước ký tự @ | Kết quả tìm kiếm hiển thị nhân viên có email chứa text tìm kiếm |
| HRM-UI-ADMIN-TC03 | Filter theo trạng thái (tất cả các options) | Frontend server đang chạy, backend services đang chạy, đã đăng nhập với tài khoản admin, có nhân viên trong hệ thống | 1. Đăng nhập với tài khoản admin<br>2. Truy cập trang `/admin`<br>3. Click nút "Bộ lọc:"<br>4. Chọn "Đang làm việc"<br>5. Kiểm tra filter được áp dụng<br>6. Reset về "Tất cả" | Filter: "Đang làm việc" → "Tất cả" | Filter button hiển thị "Đang làm việc" khi được chọn<br>Filter button hiển thị "Tất cả" khi reset |
| HRM-UI-ADMIN-TC04 | Filter theo trạng thái "Đang làm việc" | Frontend server đang chạy, backend services đang chạy, đã đăng nhập với tài khoản admin, có nhân viên trong hệ thống | 1. Đăng nhập với tài khoản admin<br>2. Truy cập trang `/admin`<br>3. Click nút "Bộ lọc:"<br>4. Chọn "Đang làm việc"<br>5. Kiểm tra kết quả filter | Filter: "Đang làm việc" | Filter button hiển thị "Đang làm việc"<br>Danh sách nhân viên được lọc theo trạng thái "Đang làm việc" |
| HRM-UI-ADMIN-TC05 | Filter theo trạng thái "Nghỉ phép" | Frontend server đang chạy, backend services đang chạy, đã đăng nhập với tài khoản admin, có nhân viên trong hệ thống | 1. Đăng nhập với tài khoản admin<br>2. Truy cập trang `/admin`<br>3. Click nút "Bộ lọc:"<br>4. Chọn "Nghỉ phép"<br>5. Kiểm tra filter được áp dụng<br>6. Reset về "Tất cả" | Filter: "Nghỉ phép" → "Tất cả" | Filter button hiển thị "Nghỉ phép" khi được chọn<br>Filter button hiển thị "Tất cả" khi reset |
| HRM-UI-ADMIN-TC06 | Filter theo trạng thái "Đã nghỉ việc" | Frontend server đang chạy, backend services đang chạy, đã đăng nhập với tài khoản admin, có nhân viên trong hệ thống | 1. Đăng nhập với tài khoản admin<br>2. Truy cập trang `/admin`<br>3. Click nút "Bộ lọc:"<br>4. Chọn "Đã nghỉ việc"<br>5. Kiểm tra filter được áp dụng<br>6. Reset về "Tất cả" | Filter: "Đã nghỉ việc" → "Tất cả" | Filter button hiển thị "Đã nghỉ việc" khi được chọn<br>Filter button hiển thị "Tất cả" khi reset |
| HRM-UI-ADMIN-TC07 | Kết hợp search và filter | Frontend server đang chạy, backend services đang chạy, đã đăng nhập với tài khoản admin, có nhân viên trong hệ thống | 1. Đăng nhập với tài khoản admin<br>2. Truy cập trang `/admin`<br>3. Nhập text tìm kiếm theo tên<br>4. Áp dụng filter "Đang làm việc"<br>5. Kiểm tra kết quả kết hợp | Search: 3 ký tự đầu của tên nhân viên<br>Filter: "Đang làm việc" | Kết quả được lọc theo cả search và filter<br>Số lượng kết quả sau filter không lớn hơn sau search |
| HRM-UI-ADMIN-TC08 | Hiển thị thông báo khi search không có kết quả | Frontend server đang chạy, backend services đang chạy, đã đăng nhập với tài khoản admin | 1. Đăng nhập với tài khoản admin<br>2. Truy cập trang `/admin`<br>3. Nhập text không tồn tại vào ô tìm kiếm<br>4. Kiểm tra thông báo | Search text: `NONEXISTENT_USER_XYZ_12345` | Hiển thị thông báo "Không có nhân viên nào"<br>Hoặc danh sách rỗng (0 nhân viên) |

---

## Tổng kết

- **Tổng số test cases**: 30
  - Backend Unit Tests: 13 test cases
  - Frontend UI Tests - Login/Register: 9 test cases
  - Frontend UI Tests - Admin Search & Filter: 8 test cases

## Ghi chú

- Tất cả test cases đã được implement và có thể chạy tự động
- Backend tests sử dụng Jest và Supertest
- Frontend tests sử dụng Selenium WebDriver với Chrome
- Test cases được thiết kế để chạy độc lập và có thể chạy song song
- Database test được tự động cleanup sau mỗi test run

