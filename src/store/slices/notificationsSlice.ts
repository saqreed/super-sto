import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from '../../types';

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockNotifications: Notification[] = [
      {
        id: '1',
        userId,
        title: 'Заявка принята',
        message: 'Ваша заявка на замену масла принята в работу',
        type: 'success',
        read: false,
        createdAt: new Date('2024-01-14T15:30:00'),
      },
      {
        id: '2',
        userId,
        title: 'Напоминание о записи',
        message: 'Завтра в 10:00 у вас запись на диагностику двигателя',
        type: 'info',
        read: false,
        createdAt: new Date('2024-01-19T18:00:00'),
      },
      {
        id: '3',
        userId,
        title: 'Заказ готов к выдаче',
        message: 'Ваш заказ деталей готов к получению',
        type: 'success',
        read: true,
        createdAt: new Date('2024-01-12T14:20:00'),
      },
    ];
    
    return mockNotifications;
  }
);

export const markAsReadAsync = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId: string) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return notificationId;
  }
);

export const markAllAsReadAsync = createAsyncThunk(
  'notifications/markAllAsRead',
  async (userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return userId;
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'createdAt'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date(),
      };
      state.notifications.unshift(notification);
      if (!notification.read) {
        state.unreadCount += 1;
      }
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      state.notifications.forEach(notification => {
        if (notification.userId === userId && !notification.read) {
          notification.read = true;
        }
      });
      state.unreadCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter(n => !n.read).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch notifications';
      })
      .addCase(markAsReadAsync.fulfilled, (state, action) => {
        const notification = state.notifications.find(n => n.id === action.payload);
        if (notification && !notification.read) {
          notification.read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAllAsReadAsync.fulfilled, (state, action) => {
        const userId = action.payload;
        state.notifications.forEach(notification => {
          if (notification.userId === userId && !notification.read) {
            notification.read = true;
          }
        });
        state.unreadCount = 0;
      });
  },
});

export const { addNotification, markAsRead, markAllAsRead } = notificationsSlice.actions;
export default notificationsSlice.reducer; 