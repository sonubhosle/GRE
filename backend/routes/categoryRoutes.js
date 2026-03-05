const express = require('express');
const router = express.Router();
const { createCategory, getAllCategories, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { protect, requireRole } = require('../middleware/auth');

router.get('/', getAllCategories);
router.use(protect, requireRole('ADMIN'));
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
