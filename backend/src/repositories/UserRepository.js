/**
 * UserRepository — Extends BaseRepository (OOP Inheritance + Repository Pattern).
 * All user-related DB operations are encapsulated here.
 */
const prisma = require('../config/db');
const BaseRepository = require('./BaseRepository');

class UserRepository extends BaseRepository {
  constructor() {
    super('user');
  }

  // --- BaseRepository interface implementations ---

  async save(data) {
    return prisma.user.create({ data });
  }

  async findById(id) {
    return prisma.user.findUnique({ where: { id } });
  }

  async update(id, data) {
    return prisma.user.update({ where: { id }, data });
  }

  async delete(id) {
    return prisma.user.delete({ where: { id } });
  }

  // --- UserRepository-specific methods ---

  async findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  }

  /**
   * Alias for save() — kept for backwards compatibility with AuthService.
   */
  async create(userData) {
    return this.save(userData);
  }
}

module.exports = new UserRepository();
