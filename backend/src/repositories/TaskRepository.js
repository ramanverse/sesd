/**
 * TaskRepository — Extends BaseRepository (OOP Inheritance + Repository Pattern).
 * All task-related DB operations are encapsulated here.
 */
const prisma = require('../config/db');
const BaseRepository = require('./BaseRepository');

class TaskRepository extends BaseRepository {
  constructor() {
    super('task');
  }

  // --- BaseRepository interface implementations ---

  async save(data) {
    return prisma.task.create({ data, include: { category: true } });
  }

  async findById(id) {
    return prisma.task.findUnique({
      where: { id },
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
    return prisma.task.delete({ where: { id } });
  }

  // --- TaskRepository-specific methods ---

  /**
   * Find all tasks belonging to a user, with optional where filters.
   * @param {string} userId
   * @param {object} filters - Additional Prisma where conditions
   */
  async findAllByUser(userId, filters = {}) {
    const where = { userId, ...filters };
    return prisma.task.findMany({
      where,
      include: { category: true },
      orderBy: { dueDate: 'asc' },
    });
  }

  /**
   * Alias for save() — backwards compatible.
   */
  async create(data) {
    return this.save(data);
  }

  /**
   * Find a task by id AND verify it belongs to userId.
   * Returns null if not found or unauthorized.
   */
  async findByUserAndId(id, userId) {
    return prisma.task.findFirst({
      where: { id, userId },
      include: { category: true },
    });
  }

  /**
   * Count tasks by status for a given user.
   */
  async countByStatus(userId) {
    const tasks = await prisma.task.findMany({ where: { userId } });
    const now = new Date();
    let total = 0, pending = 0, inProgress = 0, done = 0, overdue = 0;

    for (const t of tasks) {
      total++;
      if (t.status === 'Pending' || t.status === 'PENDING') pending++;
      else if (t.status === 'In Progress' || t.status === 'IN_PROGRESS') inProgress++;
      else if (t.status === 'Done' || t.status === 'DONE') done++;

      if (t.dueDate && new Date(t.dueDate) < now &&
          t.status !== 'Done' && t.status !== 'DONE') overdue++;
    }

    return { total, pending, inProgress, done, overdue };
  }
}

module.exports = new TaskRepository();
