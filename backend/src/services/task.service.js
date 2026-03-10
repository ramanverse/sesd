'use strict';

const taskRepository = require('../repositories/TaskRepository');
const TaskFactory = require('../models/TaskFactory');
const TaskDTO = require('../dto/TaskDTO');

// Strategy Pattern — import all filter strategies
const priorityFilter = require('../strategies/PriorityFilterStrategy');
const statusFilter = require('../strategies/StatusFilterStrategy');
const dueDateFilter = require('../strategies/DueDateFilterStrategy');

class TaskService {
  /**
   * Get all tasks for a user, applying Strategy Pattern filters in sequence.
   * Filters are applied in-memory after fetching from DB (works with SQLite & PostgreSQL).
   */
  async getTasks(userId, query = {}) {
    // Fetch all tasks for user (base query with title search if provided)
    const dbFilters = {};
    if (query.search) {
      dbFilters.title = { contains: query.search, mode: 'insensitive' };
    }
    if (query.categoryId) {
      dbFilters.categoryId = query.categoryId;
    }

    let tasks = await taskRepository.findAllByUser(userId, dbFilters);

    // Apply Strategy Pattern: filter strategies are applied polymorphically
    if (query.priority && query.priority !== 'All' && query.priority !== 'All Priorities') {
      tasks = priorityFilter.apply(tasks, query.priority);
    }
    if (query.status && query.status !== 'All') {
      tasks = statusFilter.apply(tasks, query.status);
    }
    if (query.dueDate) {
      tasks = dueDateFilter.apply(tasks, query.dueDate);
    }

    // Hydrate to Task model instances and return as JSON
    return TaskFactory.fromPrismaMany(tasks).map(t => t.toJSON());
  }

  /**
   * Get a single task by ID, verifying ownership.
   */
  async getTaskById(id, userId) {
    const record = await taskRepository.findByUserAndId(id, userId);
    if (!record) throw new Error('Task not found or you do not have permission to view it.');
    return TaskFactory.fromPrisma(record).toJSON();
  }

  /**
   * Create a new task using TaskFactory (Factory Pattern).
   * Validates input via TaskDTO before creation.
   */
  async createTask(userId, data) {
    const dto = new TaskDTO(data);
    const { valid, errors } = dto.validate(true);
    if (!valid) throw new Error(errors.join('; '));

    // Normalize priority/status to Prisma-stored values (title-case)
    const prismaData = {
      title: dto.title,
      description: dto.description,
      priority: this._normalizePriority(dto.priority),
      status: 'Pending',
      dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      userId,
      categoryId: dto.categoryId,
    };

    const record = await taskRepository.create(prismaData);
    return TaskFactory.fromPrisma(record).toJSON();
  }

  /**
   * Update an existing task. Verifies ownership before updating.
   */
  async updateTask(id, userId, data) {
    const existing = await taskRepository.findByUserAndId(id, userId);
    if (!existing) throw new Error('Task not found or you do not have permission to update it.');

    const dto = new TaskDTO(data);
    const { valid, errors } = dto.validate(false);
    if (!valid) throw new Error(errors.join('; '));

    const updateData = {};
    if (dto.title) updateData.title = dto.title;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.priority) updateData.priority = this._normalizePriority(dto.priority);
    if (dto.status) updateData.status = this._normalizeStatus(dto.status);
    if (dto.dueDate !== undefined) updateData.dueDate = dto.dueDate ? new Date(dto.dueDate) : null;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId || null;

    const record = await taskRepository.update(id, updateData);
    return TaskFactory.fromPrisma(record).toJSON();
  }

  /**
   * Mark a task as DONE. Verifies ownership.
   */
  async completeTask(id, userId) {
    const existing = await taskRepository.findByUserAndId(id, userId);
    if (!existing) throw new Error('Task not found or you do not have permission to complete it.');

    const record = await taskRepository.update(id, { status: 'Done' });
    return TaskFactory.fromPrisma(record).toJSON();
  }

  /**
   * Cycle task status: Pending -> In Progress -> Done -> Pending.
   */
  async cycleStatus(id, userId) {
    const existing = await taskRepository.findByUserAndId(id, userId);
    if (!existing) throw new Error('Task not found or you do not have permission to update it.');

    const statusMap = {
      'Pending': 'In Progress',
      'In Progress': 'Done',
      'Done': 'Pending'
    };

    const currentStatus = existing.status;
    const nextStatus = statusMap[currentStatus] || 'Pending';

    const record = await taskRepository.updateStatus(id, userId, nextStatus);
    return TaskFactory.fromPrisma(record).toJSON();
  }

  /**
   * Delete a task. Verifies ownership before deletion.
   */
  async deleteTask(id, userId) {
    const existing = await taskRepository.findByUserAndId(id, userId);
    if (!existing) throw new Error('Task not found or you do not have permission to delete it.');
    await taskRepository.delete(id);
  }

  /**
   * Get archived tasks for a user.
   */
  async getArchivedTasks(userId) {
    const records = await taskRepository.findArchivedByUser(userId);
    return TaskFactory.fromPrismaMany(records).map(t => t.toJSON());
  }

  /**
   * Move task to archive or restore it.
   */
  async archiveTask(id, userId, isArchived = true) {
    const existing = await taskRepository.findByUserAndId(id, userId);
    if (!existing) throw new Error('Task not found or you do not have permission to archive it.');
    
    const record = await taskRepository.archive(id, userId, isArchived);
    return TaskFactory.fromPrisma(record).toJSON();
  }

  // --- Private helpers for Prisma value normalization ---

  _normalizePriority(priority) {
    const map = { LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High', Low: 'Low', Medium: 'Medium', High: 'High' };
    return map[priority] || 'Medium';
  }

  _normalizeStatus(status) {
    const map = {
      PENDING: 'Pending', IN_PROGRESS: 'In Progress', DONE: 'Done',
      Pending: 'Pending', 'In Progress': 'In Progress', Done: 'Done',
    };
    return map[status] || status;
  }
}

module.exports = new TaskService();
