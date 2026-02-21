'use strict';

const express = require('express');
const dashboardController = require('../controllers/DashboardController');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', dashboardController.getStats.bind(dashboardController));

module.exports = router;
