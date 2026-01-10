c/**
 * Swagger Configuration for Profile Service
 * Port: 5002
 */

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Profile Service API',
      version: '1.0.0',
      description: `
## 👤 Profile Service

Quản lý hồ sơ nhân viên:
- Xem/cập nhật profile cá nhân
- Admin quản lý tất cả profiles
- Bootstrap profile từ Identity Service

**Port:** 5002
      `
    },
    servers: [
      { url: 'http://localhost:5002', description: 'Profile Service (Direct)' },
      { url: 'http://localhost:4000', description: 'Via Gateway' }
    ],
    tags: [
      { name: 'My Profile', description: 'Profile cá nhân' },
      { name: 'Profiles', description: 'Quản lý profiles (Admin)' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      },
      schemas: {
        Profile: {
          type: 'object',
          properties: {
            user_id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            email: { type: 'string', example: 'user@example.com' },
            full_name: { type: 'string', example: 'Nguyễn Văn A' },
            phone: { type: 'string', example: '0901234567' },
            address: { type: 'string', example: '123 Nguyễn Huệ, Q1, TP.HCM' },
            department: { type: 'string', example: 'Phòng IT' },
            position: { type: 'string', example: 'Developer' },
            status: { type: 'string', enum: ['working', 'resigned', 'on_leave'], example: 'working' },
            avatar_url: { type: 'string', example: 'https://example.com/avatar.jpg' },
            date_of_birth: { type: 'string', format: 'date', example: '1990-01-15' },
            start_date: { type: 'string', format: 'date', example: '2022-01-01' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        ProfileUpdate: {
          type: 'object',
          properties: {
            full_name: { type: 'string', example: 'Nguyễn Văn A' },
            phone: { type: 'string', example: '0901234567' },
            address: { type: 'string', example: '123 Nguyễn Huệ, Q1' },
            department: { type: 'string', example: 'Phòng IT' },
            position: { type: 'string', example: 'Developer' },
            avatar_url: { type: 'string' },
            date_of_birth: { type: 'string', format: 'date' }
          }
        },
        PublicProfile: {
          type: 'object',
          properties: {
            user_id: { type: 'string' },
            email: { type: 'string' },
            full_name: { type: 'string' },
            department: { type: 'string' },
            position: { type: 'string' },
            status: { type: 'string' }
          }
        },
        BootstrapRequest: {
          type: 'object',
          required: ['user_id', 'email'],
          properties: {
            user_id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            email: { type: 'string', example: 'user@example.com' },
            full_name: { type: 'string', example: 'Nguyễn Văn A' }
          }
        },
        Error: {
          type: 'object',
          properties: { message: { type: 'string' } }
        }
      }
    },
    paths: {
      '/profiles/me': {
        get: {
          tags: ['My Profile'],
          summary: 'Lấy profile của tôi',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Profile' } } } },
            404: { description: 'Profile không tồn tại' }
          }
        },
        put: {
          tags: ['My Profile'],
          summary: 'Cập nhật profile của tôi',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ProfileUpdate' } } }
          },
          responses: {
            200: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Profile' } } } }
          }
        }
      },
      '/profiles/public': {
        get: {
          tags: ['Profiles'],
          summary: 'Danh sách profile công khai',
          description: 'Staff và Admin đều xem được, chỉ hiển thị thông tin cơ bản',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/PublicProfile' } }
                }
              }
            }
          }
        }
      },
      '/profiles': {
        get: {
          tags: ['Profiles'],
          summary: 'Danh sách đầy đủ profiles (Admin)',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Profile' } } } } },
            403: { description: 'Chỉ Admin' }
          }
        }
      },
      '/profiles/{id}': {
        get: {
          tags: ['Profiles'],
          summary: 'Chi tiết profile (Admin)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'User ID' }],
          responses: {
            200: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Profile' } } } },
            404: { description: 'Không tìm thấy' }
          }
        },
        put: {
          tags: ['Profiles'],
          summary: 'Admin cập nhật profile',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/ProfileUpdate' } } } },
          responses: {
            200: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Profile' } } } }
          }
        },
        delete: {
          tags: ['Profiles'],
          summary: 'Xóa profile (Admin)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Xóa thành công' } }
        }
      },
      '/profiles/bootstrap': {
        post: {
          tags: ['Profiles'],
          summary: 'Bootstrap profile (Internal)',
          description: 'Được gọi từ Identity Service khi tạo user mới',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/BootstrapRequest' } } }
          },
          responses: { 201: { description: 'Tạo thành công' } }
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
    customSiteTitle: 'Profile Service API',
    swaggerOptions: { persistAuthorization: true, displayRequestDuration: true }
  }));

  console.log('📚 Swagger UI: http://localhost:5002/api-docs');
}

module.exports = { setupSwagger, swaggerSpec };

