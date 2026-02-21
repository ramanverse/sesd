'use strict';

const taskService = require('../services/task.service');

/**
 * TaskController — handles HTTP task endpoints.
 * Business logic lives in TaskService only. Controllers handle req/res.
 * All responses follow: { success, data, message }
 */
class TaskController {
  /**
   * GET /api/tasks
   * Supports query params: ?priority=&status=&dueDate=&categoryId=&search=
   */
  async getAll(req, res) {
    try {
      const tasks = await taskService.getTasks(req.user.userId, req.query);
      return res.status(200).json({ success: true, data: tasks, message: 'Tasks retrieved.' });
    } catch (error) {
      return res.status(500).json({ success: false, data: null, message: error.message });
    }
  }

  /**
   * GET /api/tasks/:id
   */
  async getOne(req, res) {
    try {
      const task = await taskService.getTaskById(req.params.id, req.user.userId);
      return res.status(200).json({ success: true, data: task, message: 'Task retrieved.' });
    } catch (error) {
      return res.status(404).json({ success: false, data: null, message: error.message });
    }
  }

  /**
   * POST /api/tasks
   * Body: { title, description, priority, dueDate, categoryId }
   */
  async create(req, res) {
    try {
      const task = await taskService.createTask(req.user.userId, req.body);
      return res.status(201).json({ success: true, data: task, message: 'Task created.' });
    } catch (error) {
      return res.status(400).json({ success: false, data: null, message: error.message });
    }
  }

  /**
   * PUT /api/tasks/:id
   * Body: partial task fields
   */
  async update(req, res) {
    try {
      const task = await taskService.updateTask(req.params.id, req.user.userId, req.body);
      return res.status(200).json({ success: true, data: task, message: 'Task updated.' });
    } catch (error) {
      return res.status(400).json({ success: false, data: null, message: error.message });
    }
  }

  /**
   * PATCH /api/tasks/:id/complete
   * Marks the task status as 'Done'.
   */
  async complete(req, res) {
    try {
      const task = await taskService.completeTask(req.params.id, req.user.userId);
      return res.status(200).json({ success: true, data: task, message: 'Task marked as complete.' });
    } catch (error) {
      return res.status(400).json({ success: false, data: null, message: error.message });
    }
  }

  /**
   * DELETE /api/tasks/:id
   */
  async remove(req, res) {
    try {
      await taskService.deleteTask(req.params.id, req.user.userId);
      return res.status(200).json({ success: true, data: null, message: 'Task deleted.' });
    } catch (error) {
      return res.status(400).json({ success: false, data: null, message: error.message });
    }
  }
}

module.exports = new TaskController();
