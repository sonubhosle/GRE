const Notification = require('../models/Notification');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/apiResponse');

const getNotifications = catchAsync(async (req, res) => {
    const notifications = await Notification.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .limit(50);
    const unreadCount = notifications.filter((n) => !n.read).length;
    return sendSuccess(res, 200, 'Notifications fetched.', { notifications, unreadCount });
});

const markAsRead = catchAsync(async (req, res) => {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    return sendSuccess(res, 200, 'Notification marked as read.');
});

const markAllAsRead = catchAsync(async (req, res) => {
    await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
    return sendSuccess(res, 200, 'All notifications marked as read.');
});

module.exports = { getNotifications, markAsRead, markAllAsRead };
