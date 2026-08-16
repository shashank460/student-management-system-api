# Student Management System API

A secure REST API for managing student registration, attendance and academic records.

## Tech stack
- Node.js 20+
- Express.js 5
- MongoDB + Mongoose
- RESTful API
- MVC architecture
- Environment-based configuration
- API-key authentication
- Helmet, CORS and centralized error handling
- Automated tests with Node.js `node:test` + Supertest
- Docker and GitHub Actions CI
- AWS-ready deployment

## Features
- Student registration and profile management
- Filter students by department and semester
- Attendance records with present/absent/late status
- Academic records with subjects, marks, grades and SGPA
- MongoDB relationships through ObjectId references
- Duplicate protection and validation
- API-key protection for `/api/v1/*`
- Health endpoint for deployment monitoring
- Automated endpoint/error-handling tests
- Consistent JSON responses and centralized errors

## Structure
```text
src/
├── config/          # environment and database configuration
├── controllers/     # business logic
├── middleware/      # authentication and error handling
├── models/          # Mongoose schemas
├── routes/          # REST endpoints
test/
└── app.test.js      # API tests
```

## Run locally
```bash
npm install
cp .env.example .env
# Configure MONGODB_URI and API_KEY in .env
npm test
npm start
```

API runs on `http://localhost:5000` by default.

## Authentication
All application endpoints under `/api/v1/*` require the `x-api-key` header.

```text
x-api-key: your-secret-api-key
```

The `/health` endpoint remains public so load balancers and deployment monitors can check service health. Never commit `.env` or real credentials.

## Endpoints
### Students
- `POST /api/v1/students`
- `GET /api/v1/students`
- `GET /api/v1/students/:id`
- `PATCH /api/v1/students/:id`
- `DELETE /api/v1/students/:id`

### Attendance
- `POST /api/v1/attendance`
- `GET /api/v1/attendance`
- `GET /api/v1/attendance/student/:studentId`
- `PATCH /api/v1/attendance/:id`
- `DELETE /api/v1/attendance/:id`

### Academic records
- `POST /api/v1/academics`
- `GET /api/v1/academics`
- `GET /api/v1/academics/student/:studentId`
- `PATCH /api/v1/academics/:id`
- `DELETE /api/v1/academics/:id`

### Health
`GET /health`

## Example student payload
```json
{
  "studentId": "REC-CSE-001",
  "name": "Aarav Sharma",
  "email": "aarav@example.com",
  "department": "Computer Science and Engineering",
  "semester": 6,
  "phone": "9876543210",
  "enrollmentYear": 2023
}
```

## AWS deployment
The application is AWS-ready for deployment on an EC2 Linux instance with MongoDB Atlas as the managed database. Set production environment variables on the server, install Node.js 20+, run `npm ci`, and start with a process manager such as PM2. Nginx can sit in front as a reverse proxy with TLS.

GitHub Actions runs the automated test suite on pushes and pull requests to `main`.

## Resume relevance
Demonstrates REST API development, MVC architecture, MongoDB data modeling, API authentication, automated testing, environment-based configuration, validation/error handling and cloud deployment readiness using the technologies listed on the resume.
