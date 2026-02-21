/**
 * Task model — extends BaseEntity (OOP Inheritance + Encapsulation).
 * Demonstrates OOP: private fields, getters/setters, validation in setters.
 */
const BaseEntity = require('./BaseEntity');

const VALID_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];
const VALID_STATUSES = ['PENDING', 'IN_PROGRESS', 'DONE'];

// Map Prisma title-case values → uppercase enums
const PRIORITY_MAP = { Low: 'LOW', Medium: 'MEDIUM', High: 'HIGH' };
const STATUS_MAP = { Pending: 'PENDING', 'In Progress': 'IN_PROGRESS', Done: 'DONE' };

class Task extends BaseEntity {
  #title;
  #description;
  #priority;
  #status;
  #dueDate;
  #userId;
  #categoryId;
  #category; // populated relation

  constructor({
    id,
    title,
    description = null,
    priority = 'MEDIUM',
    status = 'PENDING',
    dueDate = null,
    userId,
    categoryId = null,
    category = null,
    createdAt,
    updatedAt,
  } = {}) {
    super({ id, createdAt, updatedAt });
    this.#title = title;
    this.#description = description;
    // Normalize priority & status (handle Prisma title-case values)
    this.#priority = PRIORITY_MAP[priority] || (VALID_PRIORITIES.includes(priority) ? priority : 'MEDIUM');
    this.#status = STATUS_MAP[status] || (VALID_STATUSES.includes(status) ? status : 'PENDING');
    this.#dueDate = dueDate ? new Date(dueDate) : null;
    this.#userId = userId;
    this.#categoryId = categoryId;
    this.#category = category;
  }

  // --- Getters ---
  get title() { return this.#title; }
  get description() { return this.#description; }
  get priority() { return this.#priority; }
  get status() { return this.#status; }
  get dueDate() { return this.#dueDate; }
  get userId() { return this.#userId; }
  get categoryId() { return this.#categoryId; }
  get category() { return this.#category; }

  // --- Setters ---
  set title(value) {
    if (!value || value.trim().length === 0) throw new Error('Task title cannot be empty.');
    if (value.length > 255) throw new Error('Task title cannot exceed 255 characters.');
    this.#title = value.trim();
  }

  set description(value) { this.#description = value || null; }

  set priority(value) {
    const normalized = PRIORITY_MAP[value] || value;
    if (!VALID_PRIORITIES.includes(normalized)) {
      throw new Error(`Priority must be one of: ${VALID_PRIORITIES.join(', ')}`);
    }
    this.#priority = normalized;
  }

  set status(value) {
    const normalized = STATUS_MAP[value] || value;
    if (!VALID_STATUSES.includes(normalized)) {
      throw new Error(`Status must be one of: ${VALID_STATUSES.join(', ')}`);
    }
    this.#status = normalized;
  }

  set dueDate(value) { this.#dueDate = value ? new Date(value) : null; }
  set categoryId(value) { this.#categoryId = value || null; }

  /**
   * Whether the task is overdue (past due date and not done).
   */
  get isOverdue() {
    return this.#dueDate && this.#status !== 'DONE' && this.#dueDate < new Date();
  }

  toJSON() {
    return {
      ...super.toJSON(),
      title: this.#title,
      description: this.#description,
      priority: this.#priority,
      status: this.#status,
      dueDate: this.#dueDate,
      userId: this.#userId,
      categoryId: this.#categoryId,
      category: this.#category,
    };
  }

  /**
   * Hydrates a Task from a raw Prisma record.
   */
  static fromPrisma(record) {
    if (!record) return null;
    return new Task({
      id: record.id,
      title: record.title,
      description: record.description,
      priority: record.priority,
      status: record.status,
      dueDate: record.dueDate,
      userId: record.userId,
      categoryId: record.categoryId,
      category: record.category,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}

module.exports = Task;
