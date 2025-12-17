const swaggerUi = require('swagger-ui-express');

const spec = {
  openapi: '3.0.0',
  info: { title: 'Identity Service API', version: '1.0.0' },
  paths: {
    '/api/health': { get: { summary: 'Health check', responses: { 200: { description: 'ok' } } } },
    '/api/auth/register': {
      post: {
        summary: 'Register',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  fullName: { type: 'string' },
                  email: { type: 'string' },
                  password: { type: 'string' },
                  confirmPassword: { type: 'string' },
                  company: { type: 'string' },
                  title: { type: 'string' },
                },
                required: ['email', 'password', 'confirmPassword', 'fullName'],
              },
            },
          },
        },
        responses: { 201: { description: 'Created' } },
      },
    },
    '/api/auth/login': {
      post: {
        summary: 'Login',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' } }, required: ['email', 'password'] },
            },
          },
        },
        responses: { 200: { description: 'Tokens' } },
      },
    },
    '/api/auth/refresh': {
      post: {
        summary: 'Refresh token',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { refreshToken: { type: 'string' } }, required: ['refreshToken'] } } },
        },
        responses: { 200: { description: 'New tokens' } },
      },
    },
    '/api/auth/logout': {
      post: {
        summary: 'Logout (revoke refresh)',
        requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { refreshToken: { type: 'string' } } } } } },
        responses: { 200: { description: 'Logged out' } },
      },
    },
    '/api/roles': { get: { summary: 'List roles' }, post: { summary: 'Create role' } },
    '/api/roles/{id}/permissions': {
      post: {
        summary: 'Add permissions to role',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { permissionIds: { type: 'array', items: { type: 'string' } } } } } },
        },
      },
    },
    '/api/permissions': { get: { summary: 'List permissions' }, post: { summary: 'Create permission' } },
  },
  components: {
    securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
  },
  security: [{ bearerAuth: [] }],
};

module.exports = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(spec),
};
