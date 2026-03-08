const express = require('express');
const router = express.Router();
const { createCoupon, getAllCoupons, updateCoupon, deleteCoupon, applyCoupon, getActiveCoupons } = require('../controllers/couponController');
const { protect, requireRole } = require('../middleware/auth');

router.post('/apply', protect, applyCoupon);
router.get('/active', protect, getActiveCoupons);
router.use(protect, requireRole('ADMIN'));
router.get('/', getAllCoupons);
router.post('/', createCoupon);
router.put('/:id', updateCoupon);
router.delete('/:id', deleteCoupon);

module.exports = router;
