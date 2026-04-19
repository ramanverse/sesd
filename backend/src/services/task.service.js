const taskRepository = require('../repositories/task.repository');

class TaskService {
  async getTasks(userId, query) {
    const filters = {};
    if (query.status) filters.status = query.status;
    if (query.priority && query.priority !== 'All') filters.priority = query.priority;
    if (query.categoryId) filters.categoryId = query.categoryId;
    
    // For search
    if (query.search) {
      filters.title = { contains: query.search, mode: 'insensitive' };
    }

    return taskRepository.findAllByUser(userId, filters);
  }

  async createTask(userId, data) {
    return taskRepository.create({
      ...data,
      userId,
    });
  }

  async updateTask(id, userId, updates) {
    const task = await taskRepository.findById(id);
    if (!task || task.userId !== userId) {
      throw new Error('Task not found or unauthorized');
    }
    return taskRepository.update(id, updates);
  }

  async deleteTask(id, userId) {
    const task = await taskRepository.findById(id);
    if (!task || task.userId !== userId) {
      throw new Error('Task not found or unauthorized');
    }
    return taskRepository.delete(id);
  }
}

module.exports = new TaskService();
