const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/teacherController');
const { protect, requireRole } = require('../middleware/auth');

router.get('/dashboard', protect, requireRole('TEACHER', 'ADMIN'), getDashboard);

module.exports = router;
