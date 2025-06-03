import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from '../../types';
import { notificationsAPI } from '../../api/notifications';

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
  async (params?: { page?: number; limit?: number }) => {
    try {
      return await notificationsAPI.getMy(params);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка загрузки уведомлений');
    }
  }
);

export const fetchUnreadNotifications = createAsyncThunk(
  'notifications/fetchUnread',
  async () => {
    try {
      return await notificationsAPI.getUnread();
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка загрузки непрочитанных уведомлений');
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'notifications/fetchUnreadCount',
  async () => {
    try {
      return await notificationsAPI.getUnreadCount();
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка получения количества уведомлений');
    }
  }
);

export const markAsReadAsync = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId: string) => {
    try {
      await notificationsAPI.markAsRead(notificationId);
      return notificationId;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка отметки как прочитанное');
    }
  }
);

export const markAllAsReadAsync = createAsyncThunk(
  'notifications/markAllAsRead',
  async () => {
    try {
      await notificationsAPI.markAllAsRead();
      return true;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка отметки всех как прочитанные');
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/delete',
  async (notificationId: string) => {
    try {
      await notificationsAPI.delete(notificationId);
      return notificationId;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка удаления уведомления');
    }
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
    markAllAsRead: (state) => {
      state.notifications.forEach(notification => {
        if (!notification.read) {
          notification.read = true;
        }
      });
      state.unreadCount = 0;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload;
        if (Array.isArray(data)) {
          state.notifications = data;
          state.unreadCount = data.filter(n => !n.read).length;
        } else {
          state.notifications = data.notifications || [];
          state.unreadCount = data.unreadCount || 0;
        }
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки уведомлений';
      })
      .addCase(fetchUnreadNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
        state.unreadCount = action.payload.length;
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      .addCase(markAsReadAsync.fulfilled, (state, action) => {
        const notification = state.notifications.find(n => n.id === action.payload);
        if (notification && !notification.read) {
          notification.read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAllAsReadAsync.fulfilled, (state) => {
        state.notifications.forEach(notification => {
          if (!notification.read) {
            notification.read = true;
          }
        });
        state.unreadCount = 0;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(n => n.id !== action.payload);
      });
  },
});

export const { addNotification, markAsRead, markAllAsRead, clearError } = notificationsSlice.actions;
export default notificationsSlice.reducer; 