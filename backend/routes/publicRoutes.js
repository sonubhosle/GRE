const express = require('express');
const router = express.Router();
const { getPublicStats } = require('../controllers/statsController');

router.get('/stats', getPublicStats);

module.exports = router;
