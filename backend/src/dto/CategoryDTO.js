/**
 * CategoryDTO — Data Transfer Object for category creation/update requests.
 */
class CategoryDTO {
  constructor({ name, color } = {}) {
    this.name = name?.trim();
    this.color = color?.trim() || '#3730A3';
  }

  validate(requireName = true) {
    const errors = [];

    if (requireName && (!this.name || this.name.length === 0)) {
      errors.push('Category name is required.');
    }
    if (this.name && this.name.length > 100) {
      errors.push('Category name cannot exceed 100 characters.');
    }
    if (this.color && !/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(this.color)) {
      errors.push('Color must be a valid hex code (e.g. #3730A3).');
    }

    return { valid: errors.length === 0, errors };
  }
}

module.exports = CategoryDTO;
