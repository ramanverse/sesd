'use strict';

const categoryRepository = require('../repositories/CategoryRepository');
const taskRepository = require('../repositories/TaskRepository');
const CategoryDTO = require('../dto/CategoryDTO');
const Category = require('../models/Category');

class CategoryService {
  /**
   * Get all categories for a user.
   */
  async getCategories(userId) {
    const records = await categoryRepository.findAllByUser(userId);
    return records.map(r => Category.fromPrisma(r).toJSON());
  }

  /**
   * Create a new category. Validates via CategoryDTO.
   */
  async createCategory(userId, name, color) {
    const dto = new CategoryDTO({ name, color });
    const { valid, errors } = dto.validate(true);
    if (!valid) throw new Error(errors.join('; '));

    const record = await categoryRepository.create({
      userId,
      name: dto.name,
      color: dto.color,
    });
    return Category.fromPrisma(record).toJSON();
  }

  /**
   * Update a category. Verifies ownership.
   */
  async updateCategory(id, userId, updates) {
    const existing = await categoryRepository.findById(id);
    if (!existing || existing.userId !== userId) {
      throw new Error('Category not found or you do not have permission to update it.');
    }

    const dto = new CategoryDTO(updates);
    const { valid, errors } = dto.validate(false);
    if (!valid) throw new Error(errors.join('; '));

    const updateData = {};
    if (dto.name) updateData.name = dto.name;
    if (dto.color) updateData.color = dto.color;

    const record = await categoryRepository.update(id, updateData);
    return Category.fromPrisma(record).toJSON();
  }

  /**
   * Delete a category. Verifies ownership.
   */
  async deleteCategory(id, userId) {
    const existing = await categoryRepository.findById(id);
    if (!existing || existing.userId !== userId) {
      throw new Error('Category not found or you do not have permission to delete it.');
    }
    await categoryRepository.delete(id);
  }

  /**
   * Get dashboard statistics for a user.
   */
  async getDashboard(userId) {
    return taskRepository.countByStatus(userId);
  }
}

module.exports = new CategoryService();
