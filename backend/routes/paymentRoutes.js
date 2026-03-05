const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, getMyPayments, getAllPayments } = require('../controllers/paymentController');
const { protect, requireRole } = require('../middleware/auth');

router.post('/create-order', protect, requireRole('USER'), createOrder);
router.post('/verify', protect, requireRole('USER'), verifyPayment);
router.get('/history', protect, requireRole('USER'), getMyPayments);
router.get('/all', protect, requireRole('ADMIN'), getAllPayments);

module.exports = router;
