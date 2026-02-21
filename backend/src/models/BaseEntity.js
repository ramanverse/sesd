/**
 * BaseEntity - Abstract base class demonstrating OOP Inheritance.
 * All domain models (User, Task, Category) extend this class.
 * Provides common fields: id, createdAt, updatedAt.
 * Fields are PRIVATE — accessed through getters/setters (Encapsulation).
 */
class BaseEntity {
  #id;
  #createdAt;
  #updatedAt;

  constructor({ id = null, createdAt = null, updatedAt = null } = {}) {
    if (new.target === BaseEntity) {
      throw new Error('BaseEntity is abstract and cannot be instantiated directly.');
    }
    this.#id = id;
    this.#createdAt = createdAt ? new Date(createdAt) : new Date();
    this.#updatedAt = updatedAt ? new Date(updatedAt) : new Date();
  }

  // --- Getters ---
  get id() { return this.#id; }
  get createdAt() { return this.#createdAt; }
  get updatedAt() { return this.#updatedAt; }

  // --- Setters ---
  set id(value) {
    if (this.#id !== null) throw new Error('id is immutable once set.');
    this.#id = value;
  }

  set updatedAt(value) {
    this.#updatedAt = value ? new Date(value) : new Date();
  }

  /**
   * Converts entity to a plain object (for API responses / DB writes).
   * Subclasses should override and call super.toJSON() to merge fields.
   */
  toJSON() {
    return {
      id: this.#id,
      createdAt: this.#createdAt,
      updatedAt: this.#updatedAt,
    };
  }
}

module.exports = BaseEntity;
