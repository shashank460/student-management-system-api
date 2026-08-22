# Student Management System API

[![CI](https://github.com/shashank460/student-management-system-api/actions/workflows/ci.yml/badge.svg)](https://github.com/shashank460/student-management-system-api/actions/workflows/ci.yml) [![codecov](https://codecov.io/gh/shashank460/student-management-system-api/branch/main/graph/badge.svg)](https://codecov.io/gh/shashank460/student-management-system-api)

A secure, cloud-ready REST API for student registration, attendance and academic records, built with Node.js, Express and MongoDB.

## Tech stack
- Node.js 20+, Express.js 5, MongoDB + Mongoose
- JWT access + refresh tokens, bcrypt password hashing, RBAC (`admin`, `teacher`, `student`)
- Zod strict request validation
- Pino + pino-http structured logging and request tracing
- OpenAPI 3.0 + Swagger UI
- Helmet, CORS and rate limiting
- Docker + Docker Compose
- AWS EC2, MongoDB Atlas, Nginx and HTTPS/Certbot
- GitHub Actions CI/CD
- Supertest + MongoDB Memory Server + Node.js test runner + c8 coverage

## Key features
- Short-lived JWT access tokens with persisted, rotated refresh tokens
- Admin/teacher/student role-based authorization; destructive operations are admin-only
- Strict body, query and path validation with unknown-field rejection
- Stable machine-readable error codes such as `AUTH_TOKEN_INVALID`, `AUTH_FORBIDDEN`, `VALIDATION_ERROR` and `RESOURCE_CONFLICT`
- Student registration, filtering and pagination
- Attendance and academic records with referential-integrity checks
- UTC-midnight attendance normalization and duplicate-day protection
- Automatic grade/SGPA calculation from marks
- Cascade cleanup when a student is deleted
- Database-aware health endpoint
- Correlation IDs via `x-request-id`
- Graceful SIGTERM/SIGINT shutdown
- Swagger UI at `/api-docs` and OpenAPI JSON at `/api-docs.json`

## Authentication
Register/login returns an access token and refresh token. Send the access token as:

```text
Authorization: Bearer <access-token>
```

Refresh tokens are stored as hashes, rotated after use, and revoked on logout/replay. Public registration can create only `teacher` or `student` accounts; admin accounts are bootstrapped separately.

Create an admin:
```bash
node src/scripts/createAdmin.js "System Admin" admin@example.com "strong-admin-password"
```

## API documentation
After starting the API:
- Swagger UI: `http://localhost:5000/api-docs`
- OpenAPI JSON: `http://localhost:5000/api-docs.json`

## Testing
The test suite uses **Supertest + MongoDB Memory Server** for isolated integration tests. It covers authentication, refresh-token rotation/replay protection, RBAC, strict validation, error codes and Swagger availability.

```bash
npm test
npm run test:coverage
npm run lint
```

Coverage is generated in `coverage/lcov.info` and uploaded by GitHub Actions.

## Production architecture

```text
Client → HTTPS → Nginx → Node/Express API → MongoDB Atlas
                         ↓
                  JWT + RBAC + Zod
                         ↓
                  Pino + request IDs

GitHub → GitHub Actions → AWS EC2 → Docker Compose
```

See [`docs/architecture.md`](docs/architecture.md) for the detailed deployment flow.

## Local development

```bash
npm install
cp .env.example .env
# Configure MONGODB_URI, JWT_SECRET and REFRESH_TOKEN_SECRET
npm test
npm start
```

## AWS deployment

The repository includes EC2 bootstrap, production Docker Compose, Nginx/Certbot and GitHub Actions deployment configuration. A live deployment still requires your own AWS account, EC2 instance, MongoDB Atlas cluster, DNS record and GitHub Actions secrets.

## Scope

This is a **portfolio/learning project** designed to demonstrate backend and cloud engineering practices. It is not presented as an enterprise-hardened production service.
