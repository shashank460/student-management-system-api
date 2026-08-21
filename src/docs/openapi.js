export const openapiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Student Management System API',
    version: '2.0.0',
    description: 'Secure REST API for student registration, attendance and academic records.'
  },
  servers: [{ url: '/' }],
  tags: [
    { name: 'Auth' },
    { name: 'Students' },
    { name: 'Attendance' },
    { name: 'Academics' },
    { name: 'Health' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
    },
    schemas: {
      Student: {
        type: 'object',
        required: ['studentId', 'name', 'email', 'department', 'semester', 'enrollmentYear'],
        properties: {
          studentId: { type: 'string', example: 'REC-CSE-001' },
          name: { type: 'string', example: 'Aarav Sharma' },
          email: { type: 'string', format: 'email', example: 'aarav@example.com' },
          department: { type: 'string', example: 'Computer Science and Engineering' },
          semester: { type: 'integer', minimum: 1, maximum: 12, example: 6 },
          phone: { type: 'string', example: '+919876543210' },
          enrollmentYear: { type: 'integer', example: 2023 }
        }
      },
      Subject: {
        type: 'object', required: ['name', 'marks'],
        properties: { name: { type: 'string' }, marks: { type: 'number', minimum: 0, maximum: 100 } }
      },
      Error: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' }, errors: { type: 'array', items: { type: 'object' } } } }
    }
  },
  paths: {
    '/health': {
      get: { tags: ['Health'], summary: 'Database-aware health check', responses: { 200: { description: 'Healthy' }, 503: { description: 'Database unavailable' } } }
    },
    '/api/v1/auth/register': {
      post: {
        tags: ['Auth'], summary: 'Register a teacher account',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['name', 'email', 'password'], properties: { name: { type: 'string' }, email: { type: 'string', format: 'email' }, password: { type: 'string', minLength: 8 } } } } } },
        responses: { 201: { description: 'Registered' }, 400: { description: 'Validation error' }, 409: { description: 'Email already registered' } }
      }
    },
    '/api/v1/auth/login': {
      post: {
        tags: ['Auth'], summary: 'Login and receive a JWT',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['email', 'password'], properties: { email: { type: 'string', format: 'email' }, password: { type: 'string' } } } } } },
        responses: { 200: { description: 'Logged in' }, 401: { description: 'Invalid credentials' } }
      }
    },
    '/api/v1/students': {
      get: { tags: ['Students'], summary: 'List students', parameters: [{ name: 'department', in: 'query', schema: { type: 'string' } }, { name: 'semester', in: 'query', schema: { type: 'integer' } }, { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } }, { name: 'limit', in: 'query', schema: { type: 'integer', default: 20, maximum: 100 } }], responses: { 200: { description: 'Student list' } } },
      post: { tags: ['Students'], summary: 'Create a student', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Student' } } } }, responses: { 201: { description: 'Created' }, 401: { description: 'Unauthorized' } } }
    },
    '/api/v1/students/{id}': {
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      get: { tags: ['Students'], summary: 'Get student', responses: { 200: { description: 'Student' }, 404: { description: 'Not found' } } },
      patch: { tags: ['Students'], summary: 'Update student', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Updated' }, 401: { description: 'Unauthorized' }, 400: { description: 'Validation error' } } },
      delete: { tags: ['Students'], summary: 'Delete student (admin only)', security: [{ bearerAuth: [] }], responses: { 204: { description: 'Deleted' }, 403: { description: 'Admin role required' } } }
    },
    '/api/v1/students/{id}/attendance-summary': {
      get: { tags: ['Students'], summary: 'Get attendance analytics for a student', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Attendance summary' } } }
    },
    '/api/v1/students/{id}/academic-summary': {
      get: { tags: ['Students'], summary: 'Get academic analytics for a student', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Academic summary' } } }
    },
    '/api/v1/attendance': {
      get: { tags: ['Attendance'], summary: 'List attendance', responses: { 200: { description: 'Attendance list' } } },
      post: { tags: ['Attendance'], summary: 'Create attendance', security: [{ bearerAuth: [] }], responses: { 201: { description: 'Created' }, 404: { description: 'Student not found' } } }
    },
    '/api/v1/attendance/student/{studentId}': {
      get: { tags: ['Attendance'], summary: 'List attendance for a student', parameters: [{ name: 'studentId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Attendance list' } } }
    },
    '/api/v1/attendance/{id}': {
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      patch: { tags: ['Attendance'], summary: 'Update attendance', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Updated' } } },
      delete: { tags: ['Attendance'], summary: 'Delete attendance (admin only)', security: [{ bearerAuth: [] }], responses: { 204: { description: 'Deleted' }, 403: { description: 'Admin role required' } } }
    },
    '/api/v1/academics': {
      get: { tags: ['Academics'], summary: 'List academic records', responses: { 200: { description: 'Academic records' } } },
      post: { tags: ['Academics'], summary: 'Create academic record', security: [{ bearerAuth: [] }], responses: { 201: { description: 'Created' } } }
    },
    '/api/v1/academics/student/{studentId}': {
      get: { tags: ['Academics'], summary: 'List academic records for a student', parameters: [{ name: 'studentId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Academic records' } } }
    },
    '/api/v1/academics/{id}': {
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      patch: { tags: ['Academics'], summary: 'Update academic record', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Updated' } } },
      delete: { tags: ['Academics'], summary: 'Delete academic record (admin only)', security: [{ bearerAuth: [] }], responses: { 204: { description: 'Deleted' }, 403: { description: 'Admin role required' } } }
    }
  }
};
