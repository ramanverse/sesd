const prisma = require('../config/db');

class CategoryRepository {
  async findAllByUser(userId) {
    return prisma.category.findMany({
      where: { userId },
      include: {
        _count: {
          select: { tasks: true }
        }
      }
    });
  }

  async findById(id) {
    return prisma.category.findUnique({
      where: { id },
    });
  }

  async create(data) {
    return prisma.category.create({ data });
  }

  async update(id, data) {
    return prisma.category.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return prisma.category.delete({
      where: { id },
    });
  }
}

module.exports = new CategoryRepository();
