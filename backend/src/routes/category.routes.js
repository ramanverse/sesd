'use strict';

const express = require('express');
const categoryController = require('../controllers/category.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', categoryController.getAll.bind(categoryController));
router.post('/', categoryController.create.bind(categoryController));
router.put('/:id', categoryController.update.bind(categoryController));
router.delete('/:id', categoryController.remove.bind(categoryController));

module.exports = router;
