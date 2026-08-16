# Student Management System API

A production-style REST API for managing student registration, attendance and academic records.

## Tech stack
- Node.js 20+
- Express.js 5
- MongoDB + Mongoose
- RESTful API
- MVC architecture
- Environment-based configuration
- Helmet, CORS and centralized error handling
- AWS-ready deployment

## Features
- Student registration and profile management
- Filter students by department and semester
- Attendance records with present/absent/late status
- Academic records with subjects, marks, grades and SGPA
- MongoDB relationships through ObjectId references
- Duplicate protection and validation
- Health endpoint for deployment monitoring
- Consistent JSON responses and centralized errors

## Structure
```text
src/
├── config/          # environment and database configuration
├── controllers/     # business logic
├── middleware/      # centralized error handling
├── models/          # Mongoose schemas
├── routes/          # REST endpoints
├── app.js
└── server.js
```

## Run locally
```bash
npm install
cp .env.example .env
# Configure MONGODB_URI in .env
npm start
```

API runs on `http://localhost:5000` by default.

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

Never commit `.env` or database credentials. GitHub Actions can run automated checks and deploy to EC2 using repository secrets.

## Resume relevance
Demonstrates REST API development, MVC architecture, MongoDB data modeling, environment-based configuration, validation/error handling and cloud deployment readiness using the technologies listed on the resume.
