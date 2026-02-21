/**
 * TaskDTO — Data Transfer Object for task creation/update requests.
 * Validates and normalizes task data.
 */
class TaskDTO {
  constructor({ title, description, priority, status, dueDate, categoryId } = {}) {
    this.title = title?.trim();
    this.description = description?.trim() || null;
    // Normalize to uppercase for storage
    this.priority = priority ? priority.toUpperCase() : 'MEDIUM';
    this.status = status ? status.toUpperCase().replace(' ', '_') : null;
    this.dueDate = dueDate || null;
    this.categoryId = categoryId || null;
  }

  validate(requireTitle = true) {
    const errors = [];
    const validPriorities = ['LOW', 'MEDIUM', 'HIGH'];
    const validStatuses = ['PENDING', 'IN_PROGRESS', 'DONE'];

    if (requireTitle && (!this.title || this.title.length === 0)) {
      errors.push('Task title is required.');
    }
    if (this.title && this.title.length > 255) {
      errors.push('Title cannot exceed 255 characters.');
    }
    if (this.priority && !validPriorities.includes(this.priority)) {
      errors.push(`Priority must be one of: ${validPriorities.join(', ')}`);
    }
    if (this.status && !validStatuses.includes(this.status)) {
      errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
    }
    if (this.dueDate && isNaN(new Date(this.dueDate).getTime())) {
      errors.push('dueDate must be a valid date.');
    }

    return { valid: errors.length === 0, errors };
  }
}

module.exports = TaskDTO;
