const categoryRepository = require('../repositories/category.repository');

class CategoryService {
  async getCategories(userId) {
    return categoryRepository.findAllByUser(userId);
  }

  async createCategory(userId, name, color) {
    return categoryRepository.create({
      userId,
      name,
      color: color || '#3730A3',
    });
  }

  async updateCategory(id, userId, updates) {
    const category = await categoryRepository.findById(id);
    if (!category || category.userId !== userId) {
      throw new Error('Category not found or unauthorized');
    }
    return categoryRepository.update(id, updates);
  }

  async deleteCategory(id, userId) {
    const category = await categoryRepository.findById(id);
    if (!category || category.userId !== userId) {
      throw new Error('Category not found or unauthorized');
    }
    return categoryRepository.delete(id);
  }
}

module.exports = new CategoryService();
