const { PrismaClient } = require('@prisma/client');

// Force SQLite URL if the environment provides a Postgres URL,
// because schema.prisma is hardcoded to sqlite.
if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('file:')) {
  process.env.DATABASE_URL = 'file:./dev.db';
} else if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db';
}

const prisma = new PrismaClient();

module.exports = prisma;
