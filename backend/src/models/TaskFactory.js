/**
 * TaskFactory — Factory Pattern implementation.
 *
 * Centralizes Task object creation with proper defaults and validation.
 * Controllers/Services use TaskFactory.create() instead of `new Task()` directly.
 */
const Task = require('./Task');

class TaskFactory {
  /**
   * Creates a new Task with required defaults applied.
   * @param {object} data - Raw task data from request body
   * @param {string} userId - The owning user's ID
   * @returns {Task} A properly initialized Task instance
   */
  static create(data, userId) {
    if (!data.title || data.title.trim().length === 0) {
      throw new Error('Task title is required.');
    }

    return new Task({
      title: data.title.trim(),
      description: data.description || null,
      priority: data.priority || 'MEDIUM',
      status: data.status || 'PENDING',
      dueDate: data.dueDate || null,
      userId,
      categoryId: data.categoryId || null,
    });
  }

  /**
   * Creates a Task from an existing Prisma record (hydration).
   * @param {object} record - Raw Prisma task record
   * @returns {Task}
   */
  static fromPrisma(record) {
    return Task.fromPrisma(record);
  }

  /**
   * Creates an array of Task instances from Prisma records.
   * @param {Array} records
   * @returns {Task[]}
   */
  static fromPrismaMany(records) {
    return records.map(r => Task.fromPrisma(r));
  }
}

module.exports = TaskFactory;
