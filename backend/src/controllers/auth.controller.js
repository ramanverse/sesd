const authService = require('../services/auth.service');

class AuthController {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      const result = await authService.register(name, email, password);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.json(result);
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }

  async me(req, res) {
    // Just return success for now if token is valid
    res.json({ message: 'Authenticated', userId: req.user.userId });
  }
}

module.exports = new AuthController();
