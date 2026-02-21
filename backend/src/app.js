'use strict';

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');
const categoryRoutes = require('./routes/category.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();

// ─── Middleware ────────────────────────────────────────────────────────────────

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ──────────────────────────────────────────────────────────────

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, data: { status: 'ok' }, message: 'TaskFlow API is running.' });
});

// ─── API Routes ────────────────────────────────────────────────────────────────

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({ success: false, data: null, message: `Route ${req.method} ${req.path} not found.` });
});

// ─── Global Error Handler ──────────────────────────────────────────────────────

app.use((err, req, res, next) => {
  console.error('[TaskFlow Error]', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    data: null,
    message: err.message || 'An unexpected internal server error occurred.',
  });
});

module.exports = app;
