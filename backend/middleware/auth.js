const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendError } = require('../utils/apiResponse');

const protect = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) return sendError(res, 401, 'Not authenticated. Please log in.');

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return sendError(res, 401, 'User no longer exists.');
        if (user.status === 'blocked') return sendError(res, 403, 'Your account has been blocked.');

        req.user = user;
        next();
    } catch (err) {
        return sendError(res, 401, 'Invalid or expired token. Please log in again.');
    }
};

const requireRole = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return sendError(res, 403, `Access denied. Required roles: ${roles.join(', ')}`);
    }
    next();
};

module.exports = { protect, requireRole };
