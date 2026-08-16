# Student Management System API

A portfolio-grade REST API for managing student registration, attendance and academic records, built with Node.js, Express and MongoDB.

## Tech stack
- Node.js 20+
- Express.js 5
- MongoDB + Mongoose
- RESTful API + MVC architecture
- Environment-based configuration
- API-key authentication for mutating operations
- Helmet, CORS and rate limiting
- Centralized error handling
- Automated tests with Node.js `node:test` + Supertest
- Docker and GitHub Actions CI
- AWS-ready deployment

## Features
- Student registration and profile management
- Filtering and pagination by department and semester
- Attendance records with present/absent/late status
- Academic records with subjects, marks, grades and SGPA
- MongoDB relationships through ObjectId references
- Duplicate protection and Mongoose validation
- API-key protection for POST/PATCH/PUT/DELETE routes
- Rate limiting on `/api/v1`
- Public health endpoint for deployment monitoring
- Automated unit and integration tests
- Consistent JSON responses and centralized errors

## Scope
This is a learning/portfolio project, not a hardened production service. Authentication is a lightweight shared API key rather than user accounts, roles, OAuth or JWT. It demonstrates the backend engineering practices expected for an entry-level Node.js/cloud role without overstating production readiness.

## Structure
```text
src/
├── config/          # environment and database configuration
├── controllers/     # business logic
├── middleware/      # authentication, rate limiting and errors
├── models/          # Mongoose schemas
├── routes/          # REST endpoints
test/
├── studentController.test.js
├── apiKeyAuth.test.js
├── health.test.js
└── errorHandler.test.js
```

## Run locally
```bash
npm install
cp .env.example .env
# Configure MONGODB_URI and optionally API_KEY in .env
npm test
npm run lint
npm start
```

API runs on `http://localhost:5000` by default.

## Authentication
`POST`, `PATCH`, `PUT`, and `DELETE` requests under `/api/v1` require an `x-api-key` header when `API_KEY` is configured.

```text
x-api-key: your-secret-api-key
```

GET endpoints remain open for read access. The `/health` endpoint is public so load balancers and deployment monitors can check service health. Never commit `.env` or real credentials.

## Endpoints
### Students
- `POST /api/v1/students`
- `GET /api/v1/students` — supports `?department=`, `?semester=`, `?page=`, `?limit=` (maximum 100)
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

## Testing
```bash
npm test
npm run lint
```

The test suite covers controllers, API-key authentication, health/routing behavior and centralized error handling. Tests mock database operations where appropriate, so they do not require a live MongoDB server.

## AWS deployment
The application is AWS-ready for deployment on an EC2 Linux instance with MongoDB Atlas as the managed database. Set production environment variables on the server, install Node.js 20+, run `npm install`, and start with a process manager such as PM2. Nginx can sit in front as a reverse proxy with TLS.

GitHub Actions runs linting, the automated test suite and a Docker build on pushes and pull requests to `main`.

## Resume relevance
Demonstrates REST API development, MVC architecture, MongoDB data modeling, API authentication, automated testing, rate limiting, environment-based configuration, validation/error handling, Docker and cloud deployment readiness.
