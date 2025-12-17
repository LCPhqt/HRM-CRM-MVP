const dotenv = require('dotenv');

dotenv.config();

const config = {
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/identity_service',
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || 'change-me-access',
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'change-me-refresh',
  accessTokenTtl: process.env.ACCESS_TOKEN_TTL || '15m',
  refreshTokenTtl: process.env.REFRESH_TOKEN_TTL || '7d',
};

module.exports = config;
