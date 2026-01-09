/**
 * Swagger Configuration for Admin HR Service
 * Port: 5003
 */

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Admin HR Service API',
      version: '1.0.0',
      description: `
## 👔 Admin HR Service

Aggregator service cho Admin quản lý nhân viên:
- Tổng hợp data từ Identity + Profile services
- CRUD nhân viên (tạo user + profile cùng lúc)
- Chỉ Admin mới có quyền sử dụng

**Port:** 5003
      `
    },
    servers: [
      { url: 'http://localhost:5003', description: 'Admin HR Service (Direct)' },
      { url: 'http://localhost:4000', description: 'Via Gateway' }
    ],
    tags: [
      { name: 'Employees', description: 'Quản lý nhân viên (Admin only)' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      },
      schemas: {
        Employee: {
          type: 'object',
          properties: {
            user_id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            email: { type: 'string', example: 'employee@example.com' },
            full_name: { type: 'string', example: 'Phạm Văn D' },
            phone: { type: 'string', example: '0909876543' },
            department: { type: 'string', example: 'Phòng IT' },
            position: { type: 'string', example: 'Senior Developer' },
            status: { type: 'string', enum: ['working', 'resigned', 'on_leave'], example: 'working' },
            role: { type: 'string', enum: ['admin', 'staff'], example: 'staff' }
          }
        },
        EmployeeCreate: {
          type: 'object',
          required: ['email', 'password', 'full_name'],
          properties: {
            email: { type: 'string', format: 'email', example: 'newemployee@example.com' },
            password: { type: 'string', minLength: 6, example: 'password123' },
            full_name: { type: 'string', example: 'Hoàng Văn E' },
            phone: { type: 'string', example: '0909876543' },
            department: { type: 'string', example: 'Phòng HR' },
            position: { type: 'string', example: 'HR Manager' }
          }
        },
        EmployeeUpdate: {
          type: 'object',
          properties: {
            full_name: { type: 'string', example: 'Hoàng Văn E' },
            phone: { type: 'string', example: '0909876543' },
            department: { type: 'string', example: 'Phòng HR' },
            position: { type: 'string', example: 'HR Manager' },
            status: { type: 'string', enum: ['working', 'resigned', 'on_leave'] }
          }
        },
        Error: {
          type: 'object',
          properties: { message: { type: 'string' } }
        },
        Success: {
          type: 'object',
          properties: { success: { type: 'boolean', example: true } }
        }
      }
    },
    paths: {
      '/admin/employees': {
        get: {
          tags: ['Employees'],
          summary: 'Danh sách nhân viên',
          description: 'Lấy danh sách tất cả nhân viên (tổng hợp từ Identity + Profile)',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/Employee' } }
                }
              }
            },
            403: { description: 'Chỉ Admin' }
          }
        },
        post: {
          tags: ['Employees'],
          summary: 'Tạo nhân viên mới',
          description: 'Tạo user mới trong Identity Service và profile trong Profile Service',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/EmployeeCreate' } } }
          },
          responses: {
            201: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Employee' } } } },
            400: { description: 'Email đã tồn tại' }
          }
        }
      },
      '/admin/employees/{id}': {
        get: {
          tags: ['Employees'],
          summary: 'Chi tiết nhân viên',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'User ID' }
          ],
          responses: {
            200: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Employee' } } } },
            404: { description: 'Không tìm thấy nhân viên' }
          }
        },
        put: {
          tags: ['Employees'],
          summary: 'Cập nhật nhân viên',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
          ],
          requestBody: {
            content: { 'application/json': { schema: { $ref: '#/components/schemas/EmployeeUpdate' } } }
          },
          responses: {
            200: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Employee' } } } }
          }
        },
        delete: {
          tags: ['Employees'],
          summary: 'Xóa nhân viên',
          description: 'Xóa user và profile',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
          ],
          responses: {
            200: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Success' } } } }
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
    customSiteTitle: 'Admin HR Service API',
    swaggerOptions: { persistAuthorization: true, displayRequestDuration: true }
  }));

  console.log('📚 Swagger UI: http://localhost:5003/api-docs');
}

module.exports = { setupSwagger, swaggerSpec };

