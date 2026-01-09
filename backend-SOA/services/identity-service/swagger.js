/**
 * Swagger Configuration for Identity Service
 * Port: 5001
 */

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Identity Service API',
      version: '1.0.0',
      description: `
## 🔐 Identity Service

Quản lý xác thực và người dùng:
- Đăng ký, đăng nhập
- Quản lý JWT tokens
- CRUD users (Admin only)

**Port:** 5001
      `
    },
    servers: [
      { url: 'http://localhost:5001', description: 'Identity Service (Direct)' },
      { url: 'http://localhost:4000', description: 'Via Gateway' }
    ],
    tags: [
      { name: 'Auth', description: 'Xác thực người dùng' },
      { name: 'Users', description: 'Quản lý users (Admin only)' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password', 'confirm_password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            password: { type: 'string', minLength: 6, example: 'password123' },
            confirm_password: { type: 'string', example: 'password123' },
            full_name: { type: 'string', example: 'Nguyễn Văn A' }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            password: { type: 'string', example: 'password123' }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
            role: { type: 'string', enum: ['admin', 'staff'], example: 'staff' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                role: { type: 'string' }
              }
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            email: { type: 'string', example: 'user@example.com' },
            role: { type: 'string', enum: ['admin', 'staff'], example: 'staff' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        UserUpdate: {
          type: 'object',
          properties: {
            role: { type: 'string', enum: ['admin', 'staff'], example: 'staff' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Có lỗi xảy ra' }
          }
        }
      }
    },
    paths: {
      '/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Đăng ký tài khoản mới',
          description: 'Tạo tài khoản staff mới. Tài khoản đầu tiên sẽ là admin.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RegisterRequest' }
              }
            }
          },
          responses: {
            201: {
              description: 'Đăng ký thành công',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } }
            },
            400: {
              description: 'Dữ liệu không hợp lệ',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
            }
          }
        }
      },
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Đăng nhập',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginRequest' }
              }
            }
          },
          responses: {
            200: {
              description: 'Đăng nhập thành công',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } }
            },
            400: { description: 'Email hoặc mật khẩu không đúng' },
            401: { description: 'Unauthorized' }
          }
        }
      },
      '/auth/me': {
        get: {
          tags: ['Auth'],
          summary: 'Lấy thông tin user hiện tại',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Thành công',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } }
            },
            401: { description: 'Chưa đăng nhập' },
            404: { description: 'User không tồn tại' }
          }
        }
      },
      '/users': {
        get: {
          tags: ['Users'],
          summary: 'Danh sách tất cả users',
          description: 'Chỉ Admin mới có quyền xem',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Thành công',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/User' } }
                }
              }
            },
            403: { description: 'Forbidden - Chỉ Admin' }
          }
        }
      },
      '/users/{id}': {
        get: {
          tags: ['Users'],
          summary: 'Chi tiết user',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'User ID' }
          ],
          responses: {
            200: { content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
            404: { description: 'Không tìm thấy user' }
          }
        },
        put: {
          tags: ['Users'],
          summary: 'Cập nhật user',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserUpdate' }
              }
            }
          },
          responses: {
            200: { content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
            404: { description: 'Không tìm thấy user' }
          }
        },
        delete: {
          tags: ['Users'],
          summary: 'Xóa user',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
          ],
          responses: {
            200: { description: 'Xóa thành công' },
            404: { description: 'Không tìm thấy user' }
          }
        }
      }
    }
  },
  apis: []
};

const swaggerSpec = swaggerJsdoc(options);

function setupSwagger(app) {
  app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Identity Service API',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true
    }
  }));

  console.log('📚 Swagger UI: http://localhost:5001/api-docs');
}

module.exports = { setupSwagger, swaggerSpec };

