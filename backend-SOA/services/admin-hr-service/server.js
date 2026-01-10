// ============================================
// ADMIN HR SERVICE - SERVER.JS
// Quản trị nhân sự dành cho Admin
// Port: 5003
// ============================================
// ĐẶC ĐIỂM QUAN TRỌNG:
// - Service này KHÔNG có database riêng
// - Nó gọi đến Identity Service + Profile Service
//   để lấy và tổng hợp dữ liệu nhân viên
// - Đây là mô hình "Aggregator Service" trong SOA
// ============================================

// Đọc biến môi trường từ file .env (PORT, URL các service khác...)
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

// Import thư viện cần thiết
const express = require('express');  // Framework tạo web server
const cors = require('cors');        // Cho phép frontend gọi API từ domain khác

// Import module tự viết
const adminRoutes = require('./src/routes/admin');  // Các API routes cho Admin
const { setupSwagger } = require('./swagger');       // Cấu hình Swagger UI

// Port: lấy từ .env hoặc mặc định 5003
const PORT = process.env.PORT || 5003;

// ============================================
// KHỞI TẠO EXPRESS APP
// ============================================
const app = express();

// Middleware
app.use(cors());          // Bật CORS - frontend gọi được
app.use(express.json());  // Parse JSON từ request body

// ============================================
// API HEALTH CHECK
// ============================================
// Kiểm tra service có hoạt động không
// GET /health → {"status": "ok", "service": "admin-hr"}
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'admin-hr' }));

// ============================================
// SWAGGER UI
// ============================================
// Truy cập /api-docs để xem tài liệu API
setupSwagger(app);

// ============================================
// ROUTES - CHỈ ADMIN MỚI DÙNG ĐƯỢC
// ============================================
// Tất cả routes bên dưới yêu cầu đăng nhập + role admin
//
// GET    /admin/employees       → Xem danh sách nhân viên
// GET    /admin/employees/:id   → Xem chi tiết 1 nhân viên
// POST   /admin/employees       → Thêm nhân viên mới
// PUT    /admin/employees/:id   → Sửa thông tin nhân viên
// DELETE /admin/employees/:id   → Xóa nhân viên
//
app.use('/admin', adminRoutes);

// ============================================
// XỬ LÝ LỖI (Error Handler)
// ============================================
// Khi có lỗi xảy ra → trả về 500 Internal Server Error
app.use((err, _req, res, _next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({ message: 'Admin service error' });
});

// ============================================
// KHỞI ĐỘNG SERVER
// ============================================
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Admin HR service listening on port ${PORT}`);
});
