# Tổng quan các service backend (SOA)

Các service đều là Node.js/Express, chạy độc lập và được điều phối qua gateway. Auth sử dụng JWT do `identity-service` phát hành; hầu hết route cần `requireAuth` và một số cần `requireRole('admin')`.

## Gateway (`backend-hrmSOA/gateway`, mặc định port `4000`)
- Nhiệm vụ chính: làm reverse proxy duy nhất cho frontend; chuẩn hóa CORS, body JSON, logging; route `/health` để monitor.
- Điều phối: `/auth` + `/users` → Identity; `/profiles` → Profile; `/admin` → Admin HR; `/payroll` → Payroll; `/departments` → Department; `/crm` → CRM. Giữ nguyên path nên service phía sau cần prefix tương ứng.
- Lưu ý vận hành: cần các service con chạy trước; cấu hình URL service qua env.
- ENV quan trọng: `PORT`, `IDENTITY_SERVICE_URL`, `PROFILE_SERVICE_URL`, `ADMIN_HR_SERVICE_URL`, `PAYROLL_SERVICE_URL`, `DEPARTMENT_SERVICE_URL`, `CRM_SERVICE_URL`.

## Identity Service (`services/identity-service`, port `5001`)
- Nhiệm vụ chính: quản lý danh tính & quyền; cấp JWT chứa role, xác thực cho toàn bộ hệ thống.
- Luồng chính: đăng ký (`/auth/register`), đăng nhập (`/auth/login`), lấy thông tin người dùng hiện tại (`/auth/me`). Admin có CRUD user trên `/users`.
- Dữ liệu: lưu user, hash mật khẩu; seed sẵn 1 admin nếu thiếu (dùng `ADMIN_EMAIL`/`ADMIN_PASSWORD`).
- CSDL: MongoDB (`MONGO_URI`, mặc định `mongodb://127.0.0.1:27017/hrm_identity`).

## Profile Service (`services/profile-service`, port `5002`)
- Nhiệm vụ chính: lưu thông tin hồ sơ nhân viên tách biệt khỏi tài khoản (full name, vị trí, lương thưởng, liên hệ, phòng ban, ngày sinh...).
- Quyền: nhân viên xem/sửa hồ sơ của mình (`/profiles/me`); admin xem full list/chi tiết và cập nhật/xóa (`/profiles`, `/profiles/:id`); `/profiles/public` trả danh sách rút gọn cho staff; `/profiles/bootstrap` được gọi khi tạo user mới để khởi tạo hồ sơ.
- Phụ thuộc/tiêu thụ: dùng JWT từ Identity để kiểm quyền; được Admin HR gọi để hợp nhất dữ liệu.
- CSDL: MongoDB (`MONGO_URI`, mặc định `hrm_profile`).

## Admin HR Service (`services/admin-hr-service`, port `5003`)
- Nhiệm vụ chính: đầu mối quản trị nhân sự cho HR/admin, hợp nhất dữ liệu từ Identity (tài khoản) và Profile (hồ sơ).
- Quyền: chỉ admin.
- Luồng nhiệm vụ:
  - Danh sách nhân viên (`GET /admin/employees`): merge user + profile, hiển thị thông tin phong phú.
  - Tạo nhân viên (`POST /admin/employees`): gọi Identity để đăng ký user, rồi cập nhật hồ sơ ở Profile (bao gồm lương/bonus nếu gửi kèm).
  - Xem/sửa/xóa nhân viên (`/admin/employees/:id`): đồng bộ thay đổi sang cả Identity (email/role) và Profile; xóa sẽ thử xóa profile trước rồi user.
- Phụ thuộc bắt buộc: `IDENTITY_SERVICE_URL`, `PROFILE_SERVICE_URL` (truyền token admin khi gọi chéo).

## Payroll Service (`services/payroll-service`, port `5004`)
- Nhiệm vụ chính: quản lý kỳ lương (payroll run) và các dòng lương (items) theo nhân viên.
- Quyền: chỉ admin.
- Luồng nhiệm vụ:
  - Quản lý kỳ lương `/payroll/runs`: tạo, xem, cập nhật, xóa.
  - Quản lý item trong kỳ `/payroll/runs/:id/items`: thêm/cập nhật theo `user_id`, chỉnh sửa từng item.
  - Tính toán và xuất: `/payroll/runs/:id/recalc` để tính lại tổng; `/payroll/runs/:id/export` để xuất CSV.
- CSDL: MongoDB (`MONGO_URI`, mặc định `hrm_payroll`).

## Department Service (`services/department-service`, port `5006`)
- Nhiệm vụ chính: quản lý cấu trúc tổ chức/phòng ban, phục vụ phân quyền và hiển thị.
- Quyền: đăng nhập để xem; admin để tạo/cập nhật/xóa.
- Luồng nhiệm vụ: CRUD `/departments`; thuộc tính chính gồm `name`, `code` (duy nhất), `parentId`, `manager`, `status` (mặc định `active`), metadata khác.
- CSDL: MongoDB (`MONGO_URL`, mặc định `hrm-department`).

## CRM Service (`services/crm-service`, port `5007`)
- Nhiệm vụ chính: quản lý khách hàng (CRM) bao gồm tìm kiếm, phân quyền sở hữu, audit log, xóa mềm/phục hồi, import dữ liệu.
- Quyền: yêu cầu đăng nhập; staff thao tác trên khách của mình, admin thao tác tất cả; một số action (hard delete, khôi phục nhiều) yêu cầu admin.
- Luồng nhiệm vụ:
  - Đọc: list/filter/paging `/crm/customers`, đếm `/count`, thống kê `/stats`, xem log `/customers/:id/logs`, xem danh sách đã xóa `/deleted` (admin).
  - Ghi: tạo/cập nhật/xóa mềm; khôi phục từng hoặc nhiều bản ghi; hard delete đơn/đa (admin); import danh sách (`/import`) sau khi frontend parse CSV/JSON.
- Độ tin cậy: có retry kết nối Mongo và trả 503 nếu DB chưa sẵn sàng để tránh timeout gateway.
- CSDL: MongoDB (`MONGO_URL`, mặc định `mongodb://127.0.0.1:27017/hrm-crm`).

