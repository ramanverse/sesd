/**
 * User model — extends BaseEntity (OOP Inheritance + Encapsulation).
 * All fields are private; accessed through getters/setters only.
 */
const BaseEntity = require('./BaseEntity');

class User extends BaseEntity {
  #name;
  #email;
  #passwordHash;
  #role;

  constructor({ id, name, email, passwordHash, password, role = 'USER', createdAt, updatedAt } = {}) {
    super({ id, createdAt, updatedAt });
    this.#name = name;
    this.#email = email;
    // Support both 'passwordHash' (internal) and 'password' (from Prisma)
    this.#passwordHash = passwordHash || password;
    this.#role = role;
  }

  // --- Getters ---
  get name() { return this.#name; }
  get email() { return this.#email; }
  get passwordHash() { return this.#passwordHash; }
  get role() { return this.#role; }

  // --- Setters ---
  set name(value) {
    if (!value || value.trim().length === 0) throw new Error('Name cannot be empty.');
    this.#name = value.trim();
  }

  set email(value) {
    if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      throw new Error('Invalid email format.');
    }
    this.#email = value.toLowerCase().trim();
  }

  set passwordHash(value) {
    if (!value) throw new Error('Password hash cannot be empty.');
    this.#passwordHash = value;
  }

  set role(value) {
    const validRoles = ['USER', 'ADMIN'];
    if (!validRoles.includes(value)) throw new Error(`Role must be one of: ${validRoles.join(', ')}`);
    this.#role = value;
  }

  /**
   * Returns a safe public representation (no password).
   */
  toJSON() {
    return {
      ...super.toJSON(),
      name: this.#name,
      email: this.#email,
      role: this.#role,
    };
  }

  /**
   * Hydrates a User from a raw Prisma record.
   */
  static fromPrisma(record) {
    if (!record) return null;
    return new User({
      id: record.id,
      name: record.name,
      email: record.email,
      passwordHash: record.password, // Prisma field is 'password'
      role: record.role || 'USER',
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}

module.exports = User;
