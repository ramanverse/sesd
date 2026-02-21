'use strict';

const authService = require('../services/auth.service');

/**
 * AuthController — handles HTTP auth endpoints.
 * Business logic lives in AuthService; this class only handles req/res.
 * All responses follow: { success, data, message }
 */
class AuthController {
  /**
   * POST /api/auth/register
   * Body: { name, email, password }
   */
  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'name, email, and password are required.',
        });
      }

      const result = await authService.register(name, email, password);
      return res.status(201).json({
        success: true,
        data: result,
        message: 'Registration successful.',
      });
    } catch (error) {
      return res.status(400).json({ success: false, data: null, message: error.message });
    }
  }

  /**
   * POST /api/auth/login
   * Body: { email, password }
   * Returns: { accessToken, refreshToken, user }
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          success: false, data: null, message: 'email and password are required.',
        });
      }

      const result = await authService.login(email, password);
      return res.status(200).json({ success: true, data: result, message: 'Login successful.' });
    } catch (error) {
      return res.status(401).json({ success: false, data: null, message: error.message });
    }
  }

  /**
   * POST /api/auth/refresh
   * Body: { refreshToken }
   * Returns: new { accessToken, refreshToken }
   */
  async refresh(req, res) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ success: false, data: null, message: 'refreshToken is required.' });
      }

      const result = await authService.refresh(refreshToken);
      return res.status(200).json({ success: true, data: result, message: 'Token refreshed.' });
    } catch (error) {
      return res.status(401).json({ success: false, data: null, message: error.message });
    }
  }

  /**
   * POST /api/auth/logout
   * Body: { refreshToken }
   * Revokes the refresh token.
   */
  async logout(req, res) {
    try {
      const { refreshToken } = req.body;
      await authService.logout(refreshToken);
      return res.status(200).json({ success: true, data: null, message: 'Logged out successfully.' });
    } catch (error) {
      return res.status(400).json({ success: false, data: null, message: error.message });
    }
  }

  /**
   * GET /api/auth/me
   * Returns the currently authenticated user info.
   */
  async me(req, res) {
    return res.status(200).json({
      success: true,
      data: { userId: req.user.userId },
      message: 'Authenticated.',
    });
  }
}

module.exports = new AuthController();
