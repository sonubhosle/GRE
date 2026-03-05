const express = require('express');
const router = express.Router();
const { getAllUsers, toggleBlockUser, approveTeacher, deleteUser, getStats, getAdminCourses } = require('../controllers/adminController');
const { protect, requireRole } = require('../middleware/auth');

router.use(protect, requireRole('ADMIN'));

router.get('/users', getAllUsers);
router.patch('/users/:id/block', toggleBlockUser);
router.delete('/users/:id', deleteUser);
router.patch('/teachers/:id/approve', approveTeacher);
router.get('/stats', getStats);
router.get('/courses', getAdminCourses);

module.exports = router;
