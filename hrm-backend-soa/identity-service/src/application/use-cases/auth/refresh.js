const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const AppError = require('../../../shared/AppError');
const config = require('../../../config/env');

module.exports = (deps) => async ({ refreshToken }) => {
  const { refreshTokenRepository, userRepository } = deps;

  if (!refreshToken) throw new AppError('refresh token required', 400, 'VALIDATION_ERROR');

  const stored = await refreshTokenRepository.findByToken(refreshToken);
  if (!stored) throw new AppError('Invalid refresh token', 401, 'UNAUTHORIZED');

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, config.refreshTokenSecret);
  } catch (err) {
    await refreshTokenRepository.deleteByToken(refreshToken);
    throw new AppError('Invalid refresh token', 401, 'UNAUTHORIZED');
  }

  const user = await userRepository.findById(decoded.sub);
  if (!user) throw new AppError('User not found', 404, 'NOT_FOUND');
  if (user.status !== 'active') throw new AppError('User disabled', 403, 'USER_DISABLED');

  const jti = uuidv4();
  const accessToken = jwt.sign(
    { sub: user._id, roles: user.roles?.map((r) => r.name), perms: user.permissions?.map((p) => p.key), jti },
    config.accessTokenSecret,
    { expiresIn: config.accessTokenTtl }
  );
  const newRefreshToken = jwt.sign({ sub: user._id, jti }, config.refreshTokenSecret, {
    expiresIn: config.refreshTokenTtl,
  });

  const rtDecoded = jwt.decode(newRefreshToken);
  await refreshTokenRepository.deleteByToken(refreshToken);
  await refreshTokenRepository.create({
    userId: user._id,
    token: newRefreshToken,
    expiresAt: new Date(rtDecoded.exp * 1000),
  });

  return { accessToken, refreshToken: newRefreshToken };
};
