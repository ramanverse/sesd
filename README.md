# TaskFlow
*"The Quiet Authority"*

TaskFlow is a premium, full-stack task management web application built with React, Tailwind CSS, Node.js, Express, and Prisma/PostgreSQL.

## Tech Stack
- Frontend: React + Vite + Tailwind CSS + Zustand
- Backend: Node.js + Express + Prisma ORM
- Database: PostgreSQL

## Features
- JWT-based authentication
- Dashboards with live stats, upcoming sync widgets, and random motivational quotes.
- Tasks Priority Queue with high aesthetics, priority tags, and status tracking
- Focus Mode 

## Local Setup

### Database
1. Update `backend/.env` with your PostgreSQL `DATABASE_URL`.
   Example: `DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/taskflow?schema=public"`

### Backend
1. `cd backend`
2. `npm install`
3. `npx prisma migrate dev --name init` (This creates the local DB tables)
4. `npm run seed` or `node prisma/seed.js` (This spawns the demo data)
5. `npm run serve` (or `node src/server.js`) to start on port 5000.

*Demo Login: `demo@taskflow.com` / `password123`*

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev` to start on port 5173.