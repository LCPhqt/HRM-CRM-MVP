// ============================================
// FILE NÀY LÀM GÌ?
// ============================================
// Lưu địa chỉ (URL) của 2 service khác
// Để Admin HR Service biết gọi đến đâu lấy dữ liệu
// ============================================

// VÍ DỤ THỰC TẾ:
// Khi admin xem danh sách nhân viên:
// 1. Gọi Identity Service → lấy danh sách tài khoản
// 2. Gọi Profile Service  → lấy thông tin hồ sơ
// 3. Ghép 2 cái lại       → trả về cho frontend
// ============================================

// Địa chỉ Identity Service (quản lý tài khoản)
// Mặc định: http://localhost:5001
const IDENTITY_SERVICE_URL = process.env.IDENTITY_SERVICE_URL || 'http://localhost:5001';

// Địa chỉ Profile Service (quản lý hồ sơ nhân viên)
// Mặc định: http://localhost:5002
const PROFILE_SERVICE_URL = process.env.PROFILE_SERVICE_URL || 'http://localhost:5002';

// Xuất ra để các file khác import vào dùng
module.exports = { IDENTITY_SERVICE_URL, PROFILE_SERVICE_URL };
