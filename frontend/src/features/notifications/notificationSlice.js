import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchNotifications = createAsyncThunk('notifications/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/notifications');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        notifications: [],
        unreadCount: 0,
        loading: false,
    },
    reducers: {
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
            state.unreadCount += 1;
        },
        markRead: (state, action) => {
            const notif = state.notifications.find(n => n._id === action.payload);
            if (notif && !notif.read) {
                notif.read = true;
                state.unreadCount -= 1;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.notifications = action.payload.data.notifications;
                state.unreadCount = action.payload.data.unreadCount;
            });
    },
});

export const { addNotification, markRead } = notificationSlice.actions;
export default notificationSlice.reducer;
