const jwt = require('jsonwebtoken');
const config = require('../../../config/env');
const AppError = require('../../../shared/AppError');

// Middleware xác thực access token
const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) return next(new AppError('Unauthorized', 401, 'UNAUTHORIZED'));

  try {
    const payload = jwt.verify(token, config.accessTokenSecret);
    req.user = payload;
    return next();
  } catch (err) {
    return next(new AppError('Unauthorized', 401, 'UNAUTHORIZED'));
  }
};

module.exports = authMiddleware;
