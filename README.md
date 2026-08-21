# Student Management System API

A secure, portfolio-grade REST API for student registration, attendance and academic records, built with Node.js, Express and MongoDB.

## Tech stack
- Node.js 20+
- Express.js 5
- MongoDB + Mongoose
- RESTful API + MVC architecture
- JWT authentication + role-based authorization (`admin`, `teacher`)
- bcrypt password hashing
- Zod request validation with strict schemas
- Pino + pino-http structured logging and request tracing
- OpenAPI 3.0 + Swagger UI
- Helmet, CORS and rate limiting
- Docker and GitHub Actions CI
- AWS-ready deployment

## Features
- Teacher registration and JWT login
- Admin-only destructive operations
- Student registration, profile management, filtering and pagination
- Strict body, query and path validation with unknown-field rejection
- Attendance records with referential-integrity checks
- Daily attendance uniqueness through UTC-midnight normalization
- Academic records with automatic grade and SGPA calculation from marks
- Attendance and academic summary analytics per student
- Cascade cleanup of attendance and academic records when a student is deleted
- Database-aware health endpoint
- Correlation IDs via `x-request-id`
- Graceful SIGTERM/SIGINT shutdown with MongoDB disconnect
- Interactive API documentation at `/api-docs`
- JSON OpenAPI spec at `/api-docs.json`
- Automated tests with Node.js `node:test` + Supertest

## Security model
- `POST /api/v1/*` and all `PATCH`/`DELETE` operations require `Authorization: Bearer <JWT>`.
- `DELETE` operations require the `admin` role.
- GET endpoints are intentionally public for this portfolio project; production deployments should protect PII-bearing reads with authorization as well.
- Passwords are never stored in plaintext.
- Zod schemas reject unknown request fields before controllers run, preventing accidental mass assignment.
- `JWT_SECRET` is mandatory and must be at least 32 characters in production.

## Project structure
```text
src/
├── config/          # environment, database and logging
├── controllers/     # business logic
├── docs/            # OpenAPI specification
├── middleware/      # auth, validation, tracing, health and errors
├── models/          # User, Student, Attendance and AcademicRecord
├── routes/          # REST endpoints
├── scripts/         # admin bootstrap utility
├── validators/      # strict Zod schemas
└── server.js        # startup and graceful shutdown

test/                # unit and integration tests
```

## Run locally
```bash
npm install
cp .env.example .env
# Configure MONGODB_URI and JWT_SECRET in .env
npm test
npm run lint
npm start
```

API runs on `http://localhost:5000` by default.

## Authentication
Register a teacher:
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "Aarav Sharma",
  "email": "aarav@example.com",
  "password": "strong-password-123"
}
```

Login:
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "aarav@example.com",
  "password": "strong-password-123"
}
```

Use the returned token for protected writes:
```text
Authorization: Bearer <jwt>
```

### Create an admin
Admin accounts are bootstrapped from the server rather than exposed through public registration:
```bash
node src/scripts/createAdmin.js "System Admin" admin@example.com "strong-admin-password"
```

Never commit `.env`, passwords or JWT secrets.

## API documentation
After starting the application:
- Swagger UI: `http://localhost:5000/api-docs`
- OpenAPI JSON: `http://localhost:5000/api-docs.json`

## Endpoints
### Auth
- `POST /api/v1/auth/register` — creates a teacher account
- `POST /api/v1/auth/login` — returns a JWT

### Students
- `POST /api/v1/students` — teacher/admin
- `GET /api/v1/students` — public read
- `GET /api/v1/students/:id` — public read
- `PATCH /api/v1/students/:id` — teacher/admin
- `DELETE /api/v1/students/:id` — admin only; cascades related records
- `GET /api/v1/students/:id/attendance-summary`
- `GET /api/v1/students/:id/academic-summary`

### Attendance
- `POST /api/v1/attendance` — teacher/admin
- `GET /api/v1/attendance` — public read
- `GET /api/v1/attendance/student/:studentId` — public read
- `PATCH /api/v1/attendance/:id` — teacher/admin
- `DELETE /api/v1/attendance/:id` — admin only

### Academic records
- `POST /api/v1/academics` — teacher/admin
- `GET /api/v1/academics` — public read
- `GET /api/v1/academics/student/:studentId` — public read
- `PATCH /api/v1/academics/:id` — teacher/admin
- `DELETE /api/v1/academics/:id` — admin only

### Health
`GET /health` returns `200` with database status `connected` or `503` with database status `disconnected`.

## Docker Compose
A JWT secret is required before the production container starts:
```bash
JWT_SECRET='replace-with-a-long-random-secret-at-least-32-characters' docker compose up --build
```

## Testing and CI
```bash
npm test
npm run lint
```

GitHub Actions runs linting, tests and a Docker build on pushes and pull requests to `main`.

## AWS deployment
The application is AWS-ready for deployment on an EC2 Linux instance with MongoDB Atlas as the managed database. Set production environment variables on the server, install Node.js 20+, run `npm install`, and use PM2 or another process manager. Nginx can sit in front as a reverse proxy with TLS.

## Scope
This is a portfolio/learning project, not a hardened production service. It demonstrates authentication, authorization, validation, observability, API documentation, data integrity and cloud-ready backend practices without claiming enterprise-level security or availability.
