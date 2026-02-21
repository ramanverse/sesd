/**
 * CategoryRepository — Extends BaseRepository (OOP Inheritance + Repository Pattern).
 * All category-related DB operations are encapsulated here.
 */
const prisma = require('../config/db');
const BaseRepository = require('./BaseRepository');

class CategoryRepository extends BaseRepository {
  constructor() {
    super('category');
  }

  // --- BaseRepository interface implementations ---

  async save(data) {
    return prisma.category.create({ data });
  }

  async findById(id) {
    return prisma.category.findUnique({ where: { id } });
  }

  async update(id, data) {
    return prisma.category.update({ where: { id }, data });
  }

  async delete(id) {
    return prisma.category.delete({ where: { id } });
  }

  // --- CategoryRepository-specific methods ---

  /**
   * Find all categories for a user (includes task count).
   */
  async findAllByUser(userId) {
    return prisma.category.findMany({
      where: { userId },
      include: {
        _count: { select: { tasks: true } },
      },
    });
  }

  /**
   * Alias for save() — backwards compatible.
   */
  async create(data) {
    return this.save(data);
  }
}

module.exports = new CategoryRepository();
