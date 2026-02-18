# Project Idea: TaskFlow

## Overview
**TaskFlow** is a Full-Stack Task Management application designed to help individuals organize their personal and professional objectives. The application allows users to securely manage their tasks, categorize them into distinct projects, track their completion status, and monitor their overall productivity through a centralized dashboard. 

## Scope
The scope of TaskFlow includes a robust backend architecture built with Node.js and Express, heavily focusing on Object-Oriented Programming (OOP) principles and software engineering design patterns to handle business logic securely and efficiently. The frontend is a lightweight, responsive React single-page application (SPA) that consumes the RESTful APIs provided by the backend. 

## Key Features

### 1. Secure Authentication & Authorization
- User Registration and Login.
- JWT-based authentication featuring short-lived access tokens (15 minutes) and long-lived refresh tokens (7 days).
- Token rotation and secure server-side revocation on logout.

### 2. Task Management (CRUD)
- Create, read, update, and delete tasks.
- Advanced filtering of tasks via Strategy Pattern (filter by priority, status, or due date).
- Quick-action to mark tasks as complete.

### 3. Category & Project Organization
- Group tasks under custom categories.
- Assign visual colors to categories for UI distinction.
- Cascading updates/nullifications when categories are modified or deleted.

### 4. Productivity Dashboard
- Real-time statistics tracking total, pending, in-progress, completed, and overdue tasks.
- Visual completion rate indicators.

## Technical Goals (Backend Focus)
The backend is designed to strictly adhere to:
- **OOP Principles**: Utilizing Abstraction (`BaseEntity`, `BaseRepository`), Inheritance, Encapsulation (private class fields), and Polymorphism (`FilterStrategy`).
- **Clean Architecture**: Separation of concerns into Routes, Controllers, Services, and Repositories.
- **Design Patterns**: Implementation of Repository, Strategy, Factory, and Data Transfer Object (DTO) patterns.
