# TaskFlow — Backend API

A full-stack Task Management application built with **Node.js + Express + Prisma**.

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| ORM | Prisma |
| Database (dev) | SQLite |
| Database (prod) | PostgreSQL |
| Auth | JWT (access + refresh tokens) |
| Password hashing | bcryptjs |

## Architecture & Design Patterns

This backend is designed with software engineering best practices:

### OOP Principles

| Principle | Implementation |
|-----------|---------------|
| **Inheritance** | `User`, `Task`, `Category` all extend `BaseEntity` (id, createdAt, updatedAt) |
| **Encapsulation** | All model fields are `#private` — accessed only via getters/setters |
| **Abstraction** | `BaseRepository` defines generic CRUD interface; concrete repos implement it |
| **Polymorphism** | `FilterStrategy.apply()` is overridden by each concrete strategy class |

### Design Patterns

| Pattern | Location |
|---------|----------|
| **Repository Pattern** | `src/repositories/` — all DB queries go through repository classes |
| **Service Layer** | `src/services/` — business logic is isolated from HTTP concerns |
| **Strategy Pattern** | `src/strategies/` — task filtering uses interchangeable strategy classes |
| **Factory Pattern** | `src/models/TaskFactory.js` — centralizes Task creation with defaults |
| **DTO Pattern** | `src/dto/` — validates and sanitizes all API input/output |

## Project Structure

```
backend/
├── src/
│   ├── controllers/        HTTP req/res handlers only
│   │   ├── auth.controller.js
│   │   ├── task.controller.js
│   │   ├── category.controller.js
│   │   └── DashboardController.js
│   ├── services/           Business logic layer
│   │   ├── auth.service.js
│   │   ├── task.service.js
│   │   └── category.service.js
│   ├── repositories/       Data access layer (Repository Pattern)
│   │   ├── BaseRepository.js      ← Abstract base
│   │   ├── UserRepository.js
│   │   ├── TaskRepository.js
│   │   └── CategoryRepository.js
│   ├── models/             OOP domain models
│   │   ├── BaseEntity.js          ← Abstract base (Inheritance)
│   │   ├── User.js
│   │   ├── Task.js
│   │   ├── Category.js
│   │   └── TaskFactory.js         ← Factory Pattern
│   ├── dto/                Data Transfer Objects (input validation)
│   │   ├── RegisterDTO.js
│   │   ├── LoginDTO.js
│   │   ├── TaskDTO.js
│   │   └── CategoryDTO.js
│   ├── middleware/
│   │   └── auth.middleware.js     ← JWT verification
│   ├── strategies/         Strategy Pattern (task filtering)
│   │   ├── FilterStrategy.js      ← Abstract base
│   │   ├── PriorityFilterStrategy.js
│   │   ├── StatusFilterStrategy.js
│   │   └── DueDateFilterStrategy.js
│   ├── config/
│   │   └── db.js                  ← Prisma client
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── task.routes.js
│   │   ├── category.routes.js
│   │   └── dashboard.routes.js
│   ├── app.js              Express app (middleware + routes)
│   └── server.js           Entry point (starts server)
├── prisma/
│   ├── schema.prisma       Database schema
│   └── migrations/         Migration files
├── .env.example            Environment variable template
└── package.json
```

## REST API Endpoints

### Auth (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | Login → returns access + refresh tokens | No |
| POST | `/refresh` | Rotate refresh token | No |
| POST | `/logout` | Revoke refresh token | No |
| GET | `/me` | Get current user | Yes |

### Tasks (`/api/tasks`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all tasks (supports `?priority=&status=&dueDate=&search=&categoryId=`) |
| POST | `/` | Create task |
| GET | `/:id` | Get task by ID |
| PUT | `/:id` | Update task |
| PATCH | `/:id/complete` | Mark task as Done |
| DELETE | `/:id` | Delete task |

### Categories (`/api/categories`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all categories |
| POST | `/` | Create category |
| PUT | `/:id` | Update category |
| DELETE | `/:id` | Delete category |

### Dashboard (`/api/dashboard`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Task statistics: `{ total, pending, inProgress, done, overdue }` |

## Response Format

All responses follow this standard format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Human readable message"
}
```

## Setup

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your database URL and JWT secrets
```

### 3. Run migrations

```bash
npx prisma migrate dev
```

### 4. Start server

```bash
npm start
# → http://localhost:5000
```

## Authentication Flow

1. **Register/Login** → server returns `{ accessToken, refreshToken }`
2. Client stores tokens in localStorage
3. All protected requests include: `Authorization: Bearer <accessToken>`
4. When access token expires (15 min), client sends `POST /api/auth/refresh` with `{ refreshToken }`
5. Server validates refresh token (7 day expiry), issues new pair (token rotation)
6. **Logout** → `POST /api/auth/logout` revokes the refresh token in the database
