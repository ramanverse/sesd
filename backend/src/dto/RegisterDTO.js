/**
 * RegisterDTO — Data Transfer Object for user registration input.
 * Validates and sanitizes incoming registration data before it reaches the service layer.
 */
class RegisterDTO {
  constructor({ name, email, password } = {}) {
    this.name = name?.trim();
    this.email = email?.trim().toLowerCase();
    this.password = password;
  }

  /**
   * Validates the DTO fields.
   * @returns {{ valid: boolean, errors: string[] }}
   */
  validate() {
    const errors = [];

    if (!this.name || this.name.length < 2) {
      errors.push('Name must be at least 2 characters.');
    }
    if (this.name && this.name.length > 100) {
      errors.push('Name cannot exceed 100 characters.');
    }
    if (!this.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      errors.push('A valid email address is required.');
    }
    if (!this.password || this.password.length < 6) {
      errors.push('Password must be at least 6 characters.');
    }

    return { valid: errors.length === 0, errors };
  }
}

module.exports = RegisterDTO;
