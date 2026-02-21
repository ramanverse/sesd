/**
 * BaseRepository — Abstract base class for all repositories (Repository Pattern + Abstraction).
 *
 * Defines the generic CRUD interface. All concrete repositories extend this.
 * Controllers NEVER access the DB directly — all DB interaction goes through repositories.
 *
 * OOP Demonstration: Abstraction — common interface hides implementation details.
 */
class BaseRepository {
  constructor(modelName) {
    if (new.target === BaseRepository) {
      throw new Error('BaseRepository is abstract and cannot be instantiated directly.');
    }
    // The Prisma model name (e.g., 'user', 'task', 'category')
    this._modelName = modelName;
  }

  /**
   * Save (create) a new record.
   * @param {object} data
   * @returns {Promise<object>}
   */
  async save(data) {
    throw new Error(`${this.constructor.name}.save() must be implemented.`);
  }

  /**
   * Find a record by its primary key (id).
   * @param {string|number} id
   * @returns {Promise<object|null>}
   */
  async findById(id) {
    throw new Error(`${this.constructor.name}.findById() must be implemented.`);
  }

  /**
   * Delete a record by id.
   * @param {string|number} id
   * @returns {Promise<void>}
   */
  async delete(id) {
    throw new Error(`${this.constructor.name}.delete() must be implemented.`);
  }

  /**
   * Update a record by id.
   * @param {string|number} id
   * @param {object} data
   * @returns {Promise<object>}
   */
  async update(id, data) {
    throw new Error(`${this.constructor.name}.update() must be implemented.`);
  }
}

module.exports = BaseRepository;
