/**
 * DueDateFilterStrategy — Concrete strategy that filters tasks by due date.
 * Extends FilterStrategy (OOP Polymorphism — overrides apply()).
 */
const FilterStrategy = require('./FilterStrategy');

class DueDateFilterStrategy extends FilterStrategy {
  /**
   * Filters tasks due on or before the given date.
   * Can also be used to filter overdue tasks by passing 'overdue' as the value.
   *
   * @param {object[]} tasks
   * @param {string} value - ISO date string (e.g. '2025-12-31') or 'overdue'
   * @returns {object[]}
   */
  apply(tasks, value) {
    if (!value) return tasks;

    if (value === 'overdue') {
      const now = new Date();
      return tasks.filter(task => {
        return task.dueDate && new Date(task.dueDate) < now &&
          !['Done', 'DONE'].includes(task.status);
      });
    }

    const targetDate = new Date(value);
    if (isNaN(targetDate.getTime())) return tasks;

    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate <= targetDate;
    });
  }
}

module.exports = new DueDateFilterStrategy();
