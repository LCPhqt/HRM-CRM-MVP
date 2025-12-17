const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const AppError = require('../../../shared/AppError');
const config = require('../../../config/env');

module.exports = (deps) => async ({ email, password }) => {
  const { userRepository, refreshTokenRepository } = deps;

  const user = await userRepository.findByEmail(email);
  if (!user) throw new AppError('Invalid credentials', 401, 'UNAUTHORIZED');
  if (user.status !== 'active') throw new AppError('User disabled', 403, 'USER_DISABLED');

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new AppError('Invalid credentials', 401, 'UNAUTHORIZED');

  const jti = uuidv4();
  const accessToken = jwt.sign(
    { sub: user._id, roles: user.roles?.map((r) => r.name), perms: user.permissions?.map((p) => p.key), jti },
    config.accessTokenSecret,
    { expiresIn: config.accessTokenTtl }
  );
  const refreshToken = jwt.sign({ sub: user._id, jti }, config.refreshTokenSecret, { expiresIn: config.refreshTokenTtl });

  const rtDecoded = jwt.decode(refreshToken);
  await refreshTokenRepository.create({
    userId: user._id,
    token: refreshToken,
    expiresAt: new Date(rtDecoded.exp * 1000),
  });

  return { accessToken, refreshToken };
};
