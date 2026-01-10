const adminService = require('../services/adminService');

// lấy danh sách nhân viên và trả về json
async function listEmployees(req, res) {
  const data = await adminService.listEmployees(req.token);
  return res.json(data);
}
// lấy chi tiết 1 nhân viên theo id  từ url params  và trả về json
async function getEmployee(req, res) {
  const data = await adminService.getEmployee(req.token, req.params.id);
  return res.json(data);
}
// cập nhật nhân viên theo id
async function updateEmployee(req, res) {
  const data = await adminService.updateEmployee(req.token, req.params.id, req.body || {});
  return res.json(data);
}
// tạo mới trong reqbody 
async function createEmployee(req, res) {
  const data = await adminService.createEmployee(req.token, req.body || {});
  return res.status(201).json(data);
}
// xóa nhân viên theo id
async function deleteEmployee(req, res) {
  await adminService.deleteEmployee(req.token, req.params.id);
  return res.json({ success: true });
}

module.exports = { listEmployees, getEmployee, updateEmployee, deleteEmployee, createEmployee };

