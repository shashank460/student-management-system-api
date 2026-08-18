# Student Management System API

A portfolio-grade REST API for managing student registration, attendance and academic records, built with Node.js, Express and MongoDB.

## Tech stack
- Node.js 20+
- Express.js 5
- MongoDB + Mongoose
- RESTful API + MVC architecture
- Environment-based configuration
- Shared API-key authentication
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
- Referential-integrity checks before creating attendance/academic records
- Cascade cleanup of attendance and academic records when a student is deleted
- Allow-listed update fields to prevent mass assignment
- Attendance dates normalized to UTC midnight for reliable daily uniqueness
- Duplicate protection and Mongoose validation
- API-key protection for every `/api/v1/*` endpoint
- Rate limiting on `/api/v1`
- Database-aware health endpoint returning `503` when MongoDB is disconnected
- Automated unit and integration tests
- Consistent JSON responses and centralized errors

## Scope
This is a learning/portfolio project, not a hardened production service. Authentication is a lightweight shared API key rather than user accounts, roles, OAuth or JWT. It demonstrates backend engineering practices without overstating production readiness.

## Structure
```text
src/
├── config/          # environment and database configuration
├── controllers/     # business logic and allow-listed updates
├── middleware/      # authentication, health, rate limiting and errors
├── models/          # Mongoose schemas
├── routes/          # REST endpoints
test/
└── app.test.js      # API and middleware tests
```

## Run locally
```bash
npm install
cp .env.example .env
# Configure MONGODB_URI and API_KEY in .env
npm test
npm run lint
npm start
```

API runs on `http://localhost:5000` by default.

## Authentication
Every endpoint under `/api/v1` requires an `x-api-key` header.

```text
x-api-key: your-secret-api-key
```

The `/health` endpoint is public so load balancers and deployment monitors can check service health. In production, `API_KEY` is mandatory and the application fails during startup if it is missing. Never commit `.env` or real credentials.

## Docker Compose
Docker Compose also requires an API key and will fail before starting the API if it is not provided:

```bash
API_KEY='replace-with-a-long-random-secret' docker compose up --build
```

## Endpoints
### Students
- `POST /api/v1/students`
- `GET /api/v1/students` — supports `?department=`, `?semester=`, `?page=`, `?limit=` (maximum 100)
- `GET /api/v1/students/:id`
- `PATCH /api/v1/students/:id` — only profile fields are updateable; `studentId` is immutable
- `DELETE /api/v1/students/:id` — also removes related attendance and academic records

### Attendance
- `POST /api/v1/attendance` — requires an existing student; date is normalized to UTC midnight
- `GET /api/v1/attendance`
- `GET /api/v1/attendance/student/:studentId`
- `PATCH /api/v1/attendance/:id`
- `DELETE /api/v1/attendance/:id`

### Academic records
- `POST /api/v1/academics` — requires an existing student
- `GET /api/v1/academics`
- `GET /api/v1/academics/student/:studentId`
- `PATCH /api/v1/academics/:id`
- `DELETE /api/v1/academics/:id`

### Health
`GET /health` returns `200` with `database: connected` when MongoDB is healthy, otherwise `503` with `database: disconnected`.

## Testing
```bash
npm test
npm run lint
```

The test suite covers authentication, routing, database-aware health checks, validation and invalid resource IDs without requiring a live MongoDB server.

## AWS deployment
The application is AWS-ready for deployment on an EC2 Linux instance with MongoDB Atlas as the managed database. Set production environment variables on the server, install Node.js 20+, run `npm install`, and start with a process manager such as PM2. Nginx can sit in front as a reverse proxy with TLS.

GitHub Actions runs linting, the automated test suite and a Docker build on pushes and pull requests to `main`.

## Resume relevance
Demonstrates REST API development, MVC architecture, MongoDB data modeling, API authentication, automated testing, rate limiting, environment-based configuration, referential integrity, secure update handling, Docker and cloud deployment readiness.
