/**
 * Swagger Configuration for Payroll Service
 * Port: 5004
 */

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Payroll Service API',
      version: '1.0.0',
      description: `
## 💰 Payroll Service

Quản lý bảng lương:
- Tạo kỳ lương (payroll runs)
- Quản lý items lương cho từng nhân viên
- Tính toán và xuất CSV

**Port:** 5004

⚠️ **Chỉ Admin mới có quyền sử dụng**
      `
    },
    servers: [
      { url: 'http://localhost:5004', description: 'Payroll Service (Direct)' },
      { url: 'http://localhost:4000', description: 'Via Gateway' }
    ],
    tags: [
      { name: 'Payroll Runs', description: 'Quản lý kỳ lương' },
      { name: 'Payroll Items', description: 'Quản lý chi tiết lương' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      },
      schemas: {
        PayrollRun: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            period: { type: 'string', example: '2025-01', description: 'Định dạng YYYY-MM' },
            title: { type: 'string', example: 'Lương tháng 01/2025' },
            status: { type: 'string', enum: ['draft', 'processing', 'completed'], example: 'draft' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        PayrollRunCreate: {
          type: 'object',
          required: ['period'],
          properties: {
            period: { type: 'string', example: '2025-01', description: 'Định dạng YYYY-MM' },
            title: { type: 'string', example: 'Lương tháng 01/2025' }
          }
        },
        PayrollRunUpdate: {
          type: 'object',
          properties: {
            title: { type: 'string', example: 'Lương tháng 01/2025 (đã duyệt)' },
            status: { type: 'string', enum: ['draft', 'processing', 'completed'] }
          }
        },
        PayrollItem: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '507f1f77bcf86cd799439012' },
            user_id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            full_name: { type: 'string', example: 'Nguyễn Văn A' },
            email: { type: 'string', example: 'user@example.com' },
            department: { type: 'string', example: 'Phòng IT' },
            position: { type: 'string', example: 'Developer' },
            base_salary: { type: 'number', example: 20000000 },
            bonus: { type: 'number', example: 2000000 },
            deductions: { type: 'number', example: 500000 },
            net: { type: 'number', example: 21500000, description: 'base_salary + bonus - deductions' },
            status: { type: 'string', enum: ['pending', 'approved', 'paid'], example: 'pending' }
          }
        },
        PayrollItemUpsert: {
          type: 'object',
          required: ['user_id', 'email'],
          properties: {
            user_id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            email: { type: 'string', example: 'user@example.com' },
            full_name: { type: 'string', example: 'Nguyễn Văn A' },
            department: { type: 'string', example: 'Phòng IT' },
            position: { type: 'string', example: 'Developer' },
            base_salary: { type: 'number', example: 20000000 },
            bonus: { type: 'number', example: 2000000 },
            deductions: { type: 'number', example: 500000 }
          }
        },
        PayrollRunWithItems: {
          allOf: [
            { $ref: '#/components/schemas/PayrollRun' },
            {
              type: 'object',
              properties: {
                items: { type: 'array', items: { $ref: '#/components/schemas/PayrollItem' } }
              }
            }
          ]
        },
        Error: {
          type: 'object',
          properties: { message: { type: 'string' } }
        }
      }
    },
    paths: {
      '/payroll/runs': {
        get: {
          tags: ['Payroll Runs'],
          summary: 'Danh sách kỳ lương',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/PayrollRun' } }
                }
              }
            }
          }
        },
        post: {
          tags: ['Payroll Runs'],
          summary: 'Tạo kỳ lương mới',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/PayrollRunCreate' } } }
          },
          responses: {
            201: { content: { 'application/json': { schema: { $ref: '#/components/schemas/PayrollRun' } } } },
            400: { description: 'period là bắt buộc' }
          }
        }
      },
      '/payroll/runs/{id}': {
        get: {
          tags: ['Payroll Runs'],
          summary: 'Chi tiết kỳ lương (bao gồm items)',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
          ],
          responses: {
            200: { content: { 'application/json': { schema: { $ref: '#/components/schemas/PayrollRunWithItems' } } } },
            404: { description: 'Không tìm thấy kỳ lương' }
          }
        },
        put: {
          tags: ['Payroll Runs'],
          summary: 'Cập nhật kỳ lương',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
          ],
          requestBody: {
            content: { 'application/json': { schema: { $ref: '#/components/schemas/PayrollRunUpdate' } } }
          },
          responses: {
            200: { content: { 'application/json': { schema: { $ref: '#/components/schemas/PayrollRun' } } } }
          }
        },
        delete: {
          tags: ['Payroll Runs'],
          summary: 'Xóa kỳ lương',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
          ],
          responses: { 200: { description: 'Xóa thành công' } }
        }
      },
      '/payroll/runs/{id}/items': {
        post: {
          tags: ['Payroll Items'],
          summary: 'Thêm/cập nhật item lương',
          description: 'Upsert theo user_id - nếu đã tồn tại sẽ cập nhật, chưa có sẽ tạo mới',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Payroll Run ID' }
          ],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/PayrollItemUpsert' } } }
          },
          responses: {
            201: { content: { 'application/json': { schema: { $ref: '#/components/schemas/PayrollItem' } } } }
          }
        }
      },
      '/payroll/runs/{id}/items/{itemId}': {
        put: {
          tags: ['Payroll Items'],
          summary: 'Cập nhật item lương',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'itemId', in: 'path', required: true, schema: { type: 'string' } }
          ],
          requestBody: {
            content: { 'application/json': { schema: { $ref: '#/components/schemas/PayrollItemUpsert' } } }
          },
          responses: { 200: { description: 'Cập nhật thành công' } }
        }
      },
      '/payroll/runs/{id}/recalc': {
        post: {
          tags: ['Payroll Runs'],
          summary: 'Tính lại lương cho kỳ',
          description: 'Tính lại net = base_salary + bonus - deductions cho tất cả items',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
          ],
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/PayrollItem' } }
                }
              }
            }
          }
        }
      },
      '/payroll/runs/{id}/export': {
        get: {
          tags: ['Payroll Runs'],
          summary: 'Xuất CSV bảng lương',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
          ],
          responses: {
            200: {
              description: 'File CSV',
              content: { 'text/csv': { schema: { type: 'string', format: 'binary' } } }
            }
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
    customSiteTitle: 'Payroll Service API',
    swaggerOptions: { persistAuthorization: true, displayRequestDuration: true }
  }));

  console.log('📚 Swagger UI: http://localhost:5004/api-docs');
}

module.exports = { setupSwagger, swaggerSpec };

