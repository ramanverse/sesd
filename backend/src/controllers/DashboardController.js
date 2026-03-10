'use strict';

const categoryService = require('../services/category.service');

/**
 * DashboardController — handles the dashboard stats endpoint.
 */
class DashboardController {
  /**
   * GET /api/dashboard
   * Returns: { total, pending, inProgress, done, overdue, completionRate, upcomingSyncs }
   */
  async getStats(req, res) {
    try {
      const stats = await categoryService.getDashboard(req.user.userId);
      return res.status(200).json({ success: true, data: stats, message: 'Dashboard data retrieved.' });
    } catch (error) {
      return res.status(500).json({ success: false, data: null, message: error.message });
    }
  }
}

module.exports = new DashboardController();
