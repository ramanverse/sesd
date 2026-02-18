# Project Idea: TaskFlow – A Full Stack Task Management Application

## Overview

**TaskFlow** is a full-stack task management web application that allows users to create, organize, and track their tasks efficiently. It is designed with clean software engineering principles, following OOP, layered architecture (Controller → Service → Repository), and relevant design patterns.

---

## Problem Statement

People struggle to keep track of their daily tasks, deadlines, and priorities. Existing tools are either too complex or too simple. TaskFlow aims to provide a clean, minimal, and effective task management experience.

---

## Scope

### In Scope
- User registration and login (JWT-based authentication)
- Create, Read, Update, Delete (CRUD) for tasks
- Organize tasks into categories/projects
- Set priority levels (Low, Medium, High) and due dates
- Mark tasks as complete/incomplete
- Filter and search tasks
- RESTful API backend
- Simple responsive frontend (React or plain HTML/JS)

### Out of Scope
- Real-time collaboration
- Mobile app
- Third-party calendar integrations

---

## Key Features

| Feature | Description |
|---|---|
| **User Auth** | Register/Login with JWT tokens |
| **Task CRUD** | Create, view, edit, delete tasks |
| **Categories** | Group tasks under projects/categories |
| **Priority & Due Date** | Set urgency and deadlines |
| **Status Tracking** | Mark tasks as pending, in-progress, done |
| **Search & Filter** | Find tasks by name, priority, or status |
| **Dashboard** | Overview of task counts by status |

---

## Tech Stack

### Backend (75% focus)
- **Language:** Java (Spring Boot) or Node.js (Express)
- **Architecture:** Layered – Controller → Service → Repository
- **Database:** MySQL / PostgreSQL
- **Auth:** JWT (JSON Web Tokens)
- **ORM:** Hibernate (JPA) or Sequelize
- **Design Patterns Used:**
  - **Repository Pattern** – data access abstraction
  - **Service Layer Pattern** – business logic separation
  - **Factory Pattern** – creating task objects with defaults
  - **Strategy Pattern** – sorting/filtering strategies

### Frontend (25% focus)
- **Language:** HTML, CSS, JavaScript (or React)
- **Communication:** REST API calls (fetch / axios)

---

## OOP Principles Applied

| Principle | How Applied |
|---|---|
| **Encapsulation** | Each class (User, Task, Category) hides internal fields behind getters/setters |
| **Abstraction** | Service interfaces abstract business logic from controllers |
| **Inheritance** | `BaseEntity` with common fields (id, createdAt, updatedAt) extended by all models |
| **Polymorphism** | Filter strategy interface implemented by different filter classes |

---

## Project Structure (Backend)

```
src/
├── controllers/       # Handle HTTP requests
├── services/          # Business logic
├── repositories/      # Data access layer
├── models/            # Entity classes (User, Task, Category)
├── dto/               # Data Transfer Objects
├── middleware/        # Auth middleware (JWT validation)
└── config/            # DB config, app config
```

---

## Milestones

- **Milestone 1:** Idea + Diagrams (this submission)
- **Milestone 2:** Backend API implementation
- **Milestone 3:** Frontend integration + final demo
