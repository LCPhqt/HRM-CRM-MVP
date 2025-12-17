const app = require('./app');
const { connectDB } = require('./config/db');
const config = require('./config/env');
const logger = require('./shared/logger');

const start = async () => {
  try {
    await connectDB();
    app.listen(config.port, () => {
      logger.info(`Identity service listening on port ${config.port}`);
    });
  } catch (err) {
    logger.error('Failed to start server', err);
    process.exit(1);
  }
};

start();
