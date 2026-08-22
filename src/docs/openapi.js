export const openapiDocument = {
  openapi: '3.0.3',
  info: { title: 'Student Management System API', version: '2.1.0', description: 'Secure REST API for student registration, attendance and academic records.' },
  servers: [{ url: '/' }],
  tags: [{ name: 'Auth' }, { name: 'Students' }, { name: 'Attendance' }, { name: 'Academics' }, { name: 'Health' }],
  components: {
    securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    schemas: {
      Student: { type: 'object', required: ['studentId', 'name', 'email', 'department', 'semester', 'enrollmentYear'], properties: { studentId: { type: 'string', example: 'REC-CSE-001' }, name: { type: 'string' }, email: { type: 'string', format: 'email' }, department: { type: 'string' }, semester: { type: 'integer' }, phone: { type: 'string' }, enrollmentYear: { type: 'integer' } } },
      Error: { type: 'object', properties: { success: { type: 'boolean' }, code: { type: 'string', example: 'VALIDATION_ERROR' }, message: { type: 'string' }, errors: { type: 'array', items: { type: 'object' } } } }
    }
  },
  paths: {
    '/health': { get: { tags: ['Health'], summary: 'Database-aware health check', responses: { 200: { description: 'Healthy' }, 503: { description: 'Database unavailable' } } } },
    '/api/v1/auth/register': { post: { tags: ['Auth'], summary: 'Register a teacher or student account', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['name', 'email', 'password'], properties: { name: { type: 'string' }, email: { type: 'string', format: 'email' }, password: { type: 'string', minLength: 8 }, role: { type: 'string', enum: ['teacher', 'student'] }, studentId: { type: 'string', nullable: true } } } } } }, responses: { 201: { description: 'Registered' }, 400: { description: 'Validation error' }, 409: { description: 'Email already registered' } } } },
    '/api/v1/auth/login': { post: { tags: ['Auth'], summary: 'Login and receive access and refresh tokens', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['email', 'password'], properties: { email: { type: 'string', format: 'email' }, password: { type: 'string' } } } } } }, responses: { 200: { description: 'Logged in' }, 401: { description: 'Invalid credentials' } } } },
    '/api/v1/auth/refresh': { post: { tags: ['Auth'], summary: 'Rotate a refresh token', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['refreshToken'], properties: { refreshToken: { type: 'string' } } } } } }, responses: { 200: { description: 'Tokens rotated' }, 401: { description: 'Invalid or revoked refresh token' } } } },
    '/api/v1/auth/logout': { post: { tags: ['Auth'], summary: 'Revoke a refresh token', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['refreshToken'], properties: { refreshToken: { type: 'string' } } } } } }, responses: { 200: { description: 'Logged out' } } } },
    '/api/v1/students': {
      get: { tags: ['Students'], summary: 'List students', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Student list' }, 401: { description: 'Unauthorized' } } },
      post: { tags: ['Students'], summary: 'Create a student', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Student' } } } }, responses: { 201: { description: 'Created' }, 401: { description: 'Unauthorized' }, 403: { description: 'Insufficient permissions' } } }
    },
    '/api/v1/students/{id}': { parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], get: { tags: ['Students'], security: [{ bearerAuth: [] }], responses: { 200: { description: 'Student' } } }, patch: { tags: ['Students'], security: [{ bearerAuth: [] }], responses: { 200: { description: 'Updated' } } }, delete: { tags: ['Students'], summary: 'Delete student (admin only)', security: [{ bearerAuth: [] }], responses: { 204: { description: 'Deleted' }, 403: { description: 'Admin role required' } } } },
    '/api/v1/students/{id}/attendance-summary': { get: { tags: ['Students'], security: [{ bearerAuth: [] }], responses: { 200: { description: 'Attendance summary' } } } },
    '/api/v1/students/{id}/academic-summary': { get: { tags: ['Students'], security: [{ bearerAuth: [] }], responses: { 200: { description: 'Academic summary' } } } },
    '/api/v1/attendance': { get: { tags: ['Attendance'], security: [{ bearerAuth: [] }], responses: { 200: { description: 'Attendance list' } } }, post: { tags: ['Attendance'], summary: 'Create attendance (admin/teacher)', security: [{ bearerAuth: [] }], responses: { 201: { description: 'Created' }, 403: { description: 'Insufficient permissions' } } } },
    '/api/v1/attendance/student/{studentId}': { get: { tags: ['Attendance'], security: [{ bearerAuth: [] }], responses: { 200: { description: 'Attendance list' } } } },
    '/api/v1/attendance/{id}': { parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], patch: { tags: ['Attendance'], security: [{ bearerAuth: [] }], responses: { 200: { description: 'Updated' } } }, delete: { tags: ['Attendance'], summary: 'Delete attendance (admin only)', security: [{ bearerAuth: [] }], responses: { 204: { description: 'Deleted' }, 403: { description: 'Admin role required' } } } },
    '/api/v1/academics': { get: { tags: ['Academics'], security: [{ bearerAuth: [] }], responses: { 200: { description: 'Academic records' } } }, post: { tags: ['Academics'], summary: 'Create academic record (admin/teacher)', security: [{ bearerAuth: [] }], responses: { 201: { description: 'Created' }, 403: { description: 'Insufficient permissions' } } } },
    '/api/v1/academics/student/{studentId}': { get: { tags: ['Academics'], security: [{ bearerAuth: [] }], responses: { 200: { description: 'Academic records' } } } },
    '/api/v1/academics/{id}': { parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], patch: { tags: ['Academics'], security: [{ bearerAuth: [] }], responses: { 200: { description: 'Updated' } } }, delete: { tags: ['Academics'], summary: 'Delete academic record (admin only)', security: [{ bearerAuth: [] }], responses: { 204: { description: 'Deleted' }, 403: { description: 'Admin role required' } } } }
  }
};
