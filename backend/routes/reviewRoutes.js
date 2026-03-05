const express = require('express');
const router = express.Router();
const { createReview, getCourseReviews, deleteReview, replyToReview } = require('../controllers/reviewController');
const { protect, requireRole } = require('../middleware/auth');

router.post('/', protect, requireRole('USER'), createReview);
router.get('/:courseId', getCourseReviews);
router.delete('/:id', protect, deleteReview);
router.post('/:id/reply', protect, requireRole('TEACHER', 'ADMIN'), replyToReview);

module.exports = router;
