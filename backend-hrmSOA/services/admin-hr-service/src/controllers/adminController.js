const adminService = require('../services/adminService');

async function listEmployees(req, res) {
  const data = await adminService.listEmployees(req.token);
  return res.json(data);
}

async function getEmployee(req, res) {
  const data = await adminService.getEmployee(req.token, req.params.id);
  return res.json(data);
}

module.exports = { listEmployees, getEmployee };

