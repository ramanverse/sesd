/**
 * PriorityFilterStrategy — Concrete strategy that filters tasks by priority.
 * Extends FilterStrategy (OOP Polymorphism — overrides apply()).
 */
const FilterStrategy = require('./FilterStrategy');

class PriorityFilterStrategy extends FilterStrategy {
  /**
   * Filters tasks where priority matches the given value.
   * Handles both uppercase (MEDIUM) and title-case (Medium) values.
   *
   * @param {object[]} tasks
   * @param {string} value - Priority value: 'LOW' | 'MEDIUM' | 'HIGH'
   * @returns {object[]}
   */
  apply(tasks, value) {
    if (!value) return tasks;
    const normalized = value.toUpperCase();
    return tasks.filter(task => {
      const taskPriority = (task.priority || '').toUpperCase();
      return taskPriority === normalized;
    });
  }
}

module.exports = new PriorityFilterStrategy();
