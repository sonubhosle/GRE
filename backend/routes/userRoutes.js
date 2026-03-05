const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getWishlist, toggleWishlist, getEnrolledCourses, updateProgress, downloadCertificate } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { uploadImage } = require('../middleware/upload');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, uploadImage.single('photo'), updateProfile);
router.get('/wishlist', protect, getWishlist);
router.post('/wishlist', protect, toggleWishlist);
router.get('/enrolled-courses', protect, getEnrolledCourses);
router.post('/progress', protect, updateProgress);
router.get('/certificate/:courseId', protect, downloadCertificate);

module.exports = router;
