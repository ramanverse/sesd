const prisma = require('../config/db');

class TaskRepository {
  async findAllByUser(userId, filters = {}) {
    const where = { userId, ...filters };
    return prisma.task.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async findById(id) {
    return prisma.task.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  async create(data) {
    return prisma.task.create({
      data,
      include: { category: true },
    });
  }

  async update(id, data) {
    return prisma.task.update({
      where: { id },
      data,
      include: { category: true },
    });
  }

  async delete(id) {
    return prisma.task.delete({
      where: { id },
    });
  }
}

module.exports = new TaskRepository();
