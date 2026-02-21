/**
 * FilterStrategy — Abstract base class for the Strategy Pattern.
 *
 * Defines the interface that all concrete filter strategies must implement.
 * TaskService uses this interface to apply different filters polymorphically.
 *
 * OOP Demonstration: Polymorphism — each subclass overrides apply() differently.
 */
class FilterStrategy {
  /**
   * Applies a filter to a list of tasks.
   * @param {object[]} tasks - Array of raw task objects from DB
   * @param {*} value - The filter value (e.g., 'HIGH', 'PENDING', '2025-01-01')
   * @returns {object[]} Filtered array of tasks
   * @throws {Error} If called on the abstract base class
   */
  apply(tasks, value) {
    throw new Error(`FilterStrategy.apply() is abstract — must be implemented by ${this.constructor.name}`);
  }
}

module.exports = FilterStrategy;
