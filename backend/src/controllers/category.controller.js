const categoryService = require('../services/category.service');

class CategoryController {
  async getAll(req, res) {
    try {
      const categories = await categoryService.getCategories(req.user.userId);
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async create(req, res) {
    try {
      const { name, color } = req.body;
      const category = await categoryService.createCategory(req.user.userId, name, color);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const updated = await categoryService.updateCategory(req.params.id, req.user.userId, req.body);
      res.json(updated);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async remove(req, res) {
    try {
      await categoryService.deleteCategory(req.params.id, req.user.userId);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new CategoryController();
