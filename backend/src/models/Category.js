/**
 * Category model — extends BaseEntity (OOP Inheritance + Encapsulation).
 */
const BaseEntity = require('./BaseEntity');

class Category extends BaseEntity {
  #name;
  #color;
  #userId;
  #taskCount; // optional, from Prisma _count

  constructor({ id, name, color = '#3730A3', userId, taskCount = 0, createdAt, updatedAt } = {}) {
    super({ id, createdAt, updatedAt });
    this.#name = name;
    this.#color = color;
    this.#userId = userId;
    this.#taskCount = taskCount;
  }

  // --- Getters ---
  get name() { return this.#name; }
  get color() { return this.#color; }
  get userId() { return this.#userId; }
  get taskCount() { return this.#taskCount; }

  // --- Setters ---
  set name(value) {
    if (!value || value.trim().length === 0) throw new Error('Category name cannot be empty.');
    if (value.length > 100) throw new Error('Category name cannot exceed 100 characters.');
    this.#name = value.trim();
  }

  set color(value) {
    if (value && !/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value)) {
      throw new Error('Color must be a valid hex code (e.g. #3730A3).');
    }
    this.#color = value || '#3730A3';
  }

  toJSON() {
    return {
      ...super.toJSON(),
      name: this.#name,
      color: this.#color,
      userId: this.#userId,
      taskCount: this.#taskCount,
    };
  }

  /**
   * Hydrates a Category from a raw Prisma record.
   */
  static fromPrisma(record) {
    if (!record) return null;
    return new Category({
      id: record.id,
      name: record.name,
      color: record.color,
      userId: record.userId,
      taskCount: record._count?.tasks ?? 0,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}

module.exports = Category;
