const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@taskflow.com' },
    update: {},
    create: {
      email: 'demo@taskflow.com',
      name: 'Demo User',
      password: hashedPassword,
    },
  });

  console.log(`Ensured demo user: ${user.email}`);

  const categoryWork = await prisma.category.create({
    data: {
      name: 'Work',
      color: '#ef4444',
      userId: user.id,
    }
  });

  const categoryPersonal = await prisma.category.create({
    data: {
      name: 'Personal',
      color: '#3b82f6',
      userId: user.id,
    }
  });

  await prisma.task.createMany({
    data: [
      {
        title: 'Draft Project Proposal',
        description: 'Complete the initial draft for the new TaskFlow app architecture.',
        priority: 'High',
        status: 'In Progress',
        dueDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // Tomorrow
        categoryId: categoryWork.id,
        userId: user.id,
      },
      {
        title: 'Buy Groceries',
        description: 'Milk, eggs, bread, and some fruits.',
        priority: 'Medium',
        status: 'Pending',
        dueDate: new Date(),
        categoryId: categoryPersonal.id,
        userId: user.id,
      },
      {
        title: 'Weekly Sync Update',
        description: 'Prepare slides for the weekly engineering sync.',
        priority: 'Low',
        status: 'Done',
        dueDate: new Date(new Date().getTime() - 24 * 60 * 60 * 1000), // Yesterday
        categoryId: categoryWork.id,
        userId: user.id,
      }
    ]
  });

  console.log('Seeded database with categories and tasks.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
