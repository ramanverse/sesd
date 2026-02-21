'use strict';

const categoryService = require('../services/category.service');

/**
 * CategoryController — handles HTTP category endpoints.
 * All responses follow: { success, data, message }
 */
class CategoryController {
  /**
   * GET /api/categories
   */
  async getAll(req, res) {
    try {
      const categories = await categoryService.getCategories(req.user.userId);
      return res.status(200).json({ success: true, data: categories, message: 'Categories retrieved.' });
    } catch (error) {
      return res.status(500).json({ success: false, data: null, message: error.message });
    }
  }

  /**
   * POST /api/categories
   * Body: { name, color }
   */
  async create(req, res) {
    try {
      const { name, color } = req.body;
      if (!name) {
        return res.status(400).json({ success: false, data: null, message: 'Category name is required.' });
      }
      const category = await categoryService.createCategory(req.user.userId, name, color);
      return res.status(201).json({ success: true, data: category, message: 'Category created.' });
    } catch (error) {
      return res.status(400).json({ success: false, data: null, message: error.message });
    }
  }

  /**
   * PUT /api/categories/:id
   * Body: { name?, color? }
   */
  async update(req, res) {
    try {
      const category = await categoryService.updateCategory(req.params.id, req.user.userId, req.body);
      return res.status(200).json({ success: true, data: category, message: 'Category updated.' });
    } catch (error) {
      return res.status(400).json({ success: false, data: null, message: error.message });
    }
  }

  /**
   * DELETE /api/categories/:id
   */
  async remove(req, res) {
    try {
      await categoryService.deleteCategory(req.params.id, req.user.userId);
      return res.status(200).json({ success: true, data: null, message: 'Category deleted.' });
    } catch (error) {
      return res.status(400).json({ success: false, data: null, message: error.message });
    }
  }
}

module.exports = new CategoryController();
