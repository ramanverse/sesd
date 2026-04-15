const { PrismaClient } = require('@prisma/client');

let datasourceUrl = process.env.DATABASE_URL;
if (!datasourceUrl || !datasourceUrl.startsWith('file:')) {
  datasourceUrl = 'file:./dev.db';
}

const prisma = new PrismaClient({
  datasourceUrl
});

module.exports = prisma;
