/**
 * StatusFilterStrategy — Concrete strategy that filters tasks by status.
 * Extends FilterStrategy (OOP Polymorphism — overrides apply()).
 */
const FilterStrategy = require('./FilterStrategy');

// Maps URL-friendly values → Prisma stored values
const STATUS_ALIASES = {
  PENDING: ['Pending', 'PENDING'],
  IN_PROGRESS: ['In Progress', 'IN_PROGRESS'],
  DONE: ['Done', 'DONE'],
};

class StatusFilterStrategy extends FilterStrategy {
  /**
   * Filters tasks where status matches the given value.
   * Accepts both 'IN_PROGRESS' and 'In Progress' formats.
   *
   * @param {object[]} tasks
   * @param {string} value - Status: 'PENDING' | 'IN_PROGRESS' | 'DONE'
   * @returns {object[]}
   */
  apply(tasks, value) {
    if (!value) return tasks;
    const normalized = value.toUpperCase().replace(' ', '_');
    const aliases = STATUS_ALIASES[normalized] || [value];

    return tasks.filter(task => {
      return aliases.includes(task.status);
    });
  }
}

module.exports = new StatusFilterStrategy();
