/**
 * Swagger Configuration for Department Service
 * Port: 5006
 */

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Department Service API',
      version: '1.0.0',
      description: `
## 🏢 Department Service

Quản lý phòng ban:
- Xem danh sách và chi tiết phòng ban (Staff + Admin)
- CRUD phòng ban (Admin only)
- Hỗ trợ cấu trúc phòng ban cha-con

**Port:** 5006
      `
    },
    servers: [
      { url: 'http://localhost:5006', description: 'Department Service (Direct)' },
      { url: 'http://localhost:4000', description: 'Via Gateway' }
    ],
    tags: [
      { name: 'Departments', description: 'Quản lý phòng ban' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      },
      schemas: {
        Department: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'Phòng IT' },
            code: { type: 'string', example: 'IT' },
            parentId: { type: 'string', nullable: true, example: null, description: 'ID phòng ban cha' },
            location: { type: 'string', example: 'Tầng 5, Tòa A' },
            manager: { type: 'string', example: 'Trần Văn B' },
            staffCount: { type: 'integer', example: 15 },
            description: { type: 'string', example: 'Phòng công nghệ thông tin' },
            status: { type: 'string', enum: ['active', 'inactive'], example: 'active' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        DepartmentCreate: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', example: 'Phòng Marketing' },
            code: { type: 'string', example: 'MKT', description: 'Mã phòng ban (unique)' },
            parentId: { type: 'string', nullable: true, description: 'ID phòng ban cha' },
            location: { type: 'string', example: 'Tầng 3, Tòa B' },
            manager: { type: 'string', example: 'Lê Văn C' },
            staffCount: { type: 'integer', example: 10 },
            description: { type: 'string', example: 'Phòng tiếp thị và truyền thông' },
            status: { type: 'string', enum: ['active', 'inactive'], default: 'active' }
          }
        },
        DepartmentUpdate: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Phòng Marketing' },
            code: { type: 'string', example: 'MKT' },
            parentId: { type: 'string', nullable: true },
            location: { type: 'string' },
            manager: { type: 'string' },
            staffCount: { type: 'integer' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['active', 'inactive'] }
          }
        },
        Error: {
          type: 'object',
          properties: { message: { type: 'string' } }
        },
        Success: {
          type: 'object',
          properties: { message: { type: 'string', example: 'Xóa phòng ban thành công' } }
        }
      }
    },
    paths: {
      '/departments': {
        get: {
          tags: ['Departments'],
          summary: 'Danh sách phòng ban',
          description: 'Staff và Admin đều xem được',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/Department' } }
                }
              }
            }
          }
        },
        post: {
          tags: ['Departments'],
          summary: 'Tạo phòng ban mới (Admin)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/DepartmentCreate' } } }
          },
          responses: {
            201: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Department' } } } },
            400: { description: 'Tên hoặc mã phòng ban đã tồn tại' },
            403: { description: 'Chỉ Admin' }
          }
        }
      },
      '/departments/{id}': {
        get: {
          tags: ['Departments'],
          summary: 'Chi tiết phòng ban',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Department ID' }
          ],
          responses: {
            200: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Department' } } } },
            404: { description: 'Không tìm thấy phòng ban' }
          }
        },
        put: {
          tags: ['Departments'],
          summary: 'Cập nhật phòng ban (Admin)',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
          ],
          requestBody: {
            content: { 'application/json': { schema: { $ref: '#/components/schemas/DepartmentUpdate' } } }
          },
          responses: {
            200: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Department' } } } },
            400: { description: 'Tên hoặc mã đã tồn tại' },
            403: { description: 'Chỉ Admin' },
            404: { description: 'Không tìm thấy' }
          }
        },
        delete: {
          tags: ['Departments'],
          summary: 'Xóa phòng ban (Admin)',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
          ],
          responses: {
            200: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Success' } } } },
            403: { description: 'Chỉ Admin' },
            404: { description: 'Không tìm thấy' }
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
    customSiteTitle: 'Department Service API',
    swaggerOptions: { persistAuthorization: true, displayRequestDuration: true }
  }));

  console.log('📚 Swagger UI: http://localhost:5006/api-docs');
}

module.exports = { setupSwagger, swaggerSpec };

