import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import courseReducer from '../features/courses/courseSlice';
import notificationReducer from '../features/notifications/notificationSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        courses: courseReducer,
        notifications: notificationReducer,
    },
    devTools: import.meta.env.DEV,
});

export default store;
