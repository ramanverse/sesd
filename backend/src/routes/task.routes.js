'use strict';

const express = require('express');
const taskController = require('../controllers/task.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// All task routes require authentication
router.use(authMiddleware);

router.get('/', taskController.getAll.bind(taskController));
router.get('/archived', taskController.getArchived.bind(taskController));
router.post('/', taskController.create.bind(taskController));
router.get('/:id', taskController.getOne.bind(taskController));
router.put('/:id', taskController.update.bind(taskController));
router.patch('/:id/complete', taskController.complete.bind(taskController));
router.patch('/:id/status', taskController.cycleStatus.bind(taskController));
router.patch('/:id/archive', taskController.toggleArchive.bind(taskController));
router.delete('/:id', taskController.remove.bind(taskController));

module.exports = router;
