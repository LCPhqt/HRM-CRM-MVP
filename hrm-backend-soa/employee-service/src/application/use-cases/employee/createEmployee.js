const AppError = require('../../../shared/AppError');
const EmployeeStatus = require('../../../domain/value-objects/EmployeeStatus');

// Use-case: tạo nhân viên, kiểm tra input tối thiểu
module.exports = (deps) => async (payload) => {
  const { employeeRepository } = deps;
  
  if (!payload.name || !payload.email || !/^[^@]+@[^@]+\.[^@]+$/.test(payload.email)) {
    throw new AppError('name and valid email are required', 400, 'VALIDATION_ERROR');
  }

  const status = payload.status || EmployeeStatus.ACTIVE;
  return employeeRepository.create({ ...payload, status });
};
