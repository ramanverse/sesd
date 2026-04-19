const taskService = require('../services/task.service');

class TaskController {
  async getAll(req, res) {
    try {
      const tasks = await taskService.getTasks(req.user.userId, req.query);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async create(req, res) {
    try {
      const task = await taskService.createTask(req.user.userId, req.body);
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const updated = await taskService.updateTask(req.params.id, req.user.userId, req.body);
      res.json(updated);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async remove(req, res) {
    try {
      await taskService.deleteTask(req.params.id, req.user.userId);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new TaskController();
