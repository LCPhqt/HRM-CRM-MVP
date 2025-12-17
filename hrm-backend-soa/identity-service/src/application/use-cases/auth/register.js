const bcrypt = require('bcryptjs');
const AppError = require('../../../shared/AppError');

module.exports = (deps) => async ({ email, password, confirmPassword, fullName, company, title }) => {
  const { userRepository } = deps;

  if (!email || !password || !confirmPassword || !fullName) {
    throw new AppError('fullName,email, password, confirmPassword are required', 400, 'VALIDATION_ERROR');
  }
  if (password !== confirmPassword) {
    throw new AppError('password and confirmPassword do not match', 400, 'VALIDATION_ERROR');
  }

  const existing = await userRepository.findByEmail(email);
  if (existing) {
    throw new AppError('Email already exists', 409, 'EMAIL_EXISTS');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await userRepository.create({
    fullName,
    email,
    passwordHash,
    company,
    title,
    roles: [],
    permissions: [],
  });
  return {  fullName: user.fullName, id: user._id, email: user.email, company: user.company, title: user.title };
};
