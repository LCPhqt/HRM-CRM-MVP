const path = require('path');

module.exports = {
  testEnvironment: 'node',
  testTimeout: 30000,
  coveragePathIgnorePatterns: ['/node_modules/', '/tests/'],
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    '../../backend-SOA/services/identity-service/src/**/*.js',
    '!../../backend-SOA/services/identity-service/src/config/**',
    '!../../backend-SOA/services/identity-service/server.js'
  ],
  setupFilesAfterEnv: ['<rootDir>/setup.js'],
  // Add root directory to module resolution
  moduleDirectories: ['node_modules', path.resolve(__dirname, '../../..')],
  roots: ['<rootDir>'],
  // Map module paths
  moduleNameMapper: {
    '^../src/(.*)$': path.resolve(__dirname, '../../backend-SOA/services/identity-service/src/$1')
  }
};

