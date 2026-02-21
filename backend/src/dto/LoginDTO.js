/**
 * LoginDTO — Data Transfer Object for login input.
 */
class LoginDTO {
  constructor({ email, password } = {}) {
    this.email = email?.trim().toLowerCase();
    this.password = password;
  }

  validate() {
    const errors = [];
    if (!this.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      errors.push('A valid email address is required.');
    }
    if (!this.password) {
      errors.push('Password is required.');
    }
    return { valid: errors.length === 0, errors };
  }
}

module.exports = LoginDTO;
