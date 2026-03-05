const express = require('express');
const router = express.Router();
const { createCoupon, getAllCoupons, updateCoupon, deleteCoupon, applyCoupon } = require('../controllers/couponController');
const { protect, requireRole } = require('../middleware/auth');

router.post('/apply', protect, applyCoupon);
router.use(protect, requireRole('ADMIN'));
router.get('/', getAllCoupons);
router.post('/', createCoupon);
router.put('/:id', updateCoupon);
router.delete('/:id', deleteCoupon);

module.exports = router;
