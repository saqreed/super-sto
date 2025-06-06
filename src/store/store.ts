import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import servicesSlice from './slices/servicesSlice';
import appointmentsSlice from './slices/appointmentsSlice';
import productsSlice from './slices/productsSlice';
import ordersSlice from './slices/ordersSlice';
import chatSlice from './slices/chatSlice';
import notificationsSlice from './slices/notificationsSlice';
import analyticsSlice from './slices/analyticsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    services: servicesSlice,
    appointments: appointmentsSlice,
    products: productsSlice,
    orders: ordersSlice,
    chat: chatSlice,
    notifications: notificationsSlice,
    analytics: analyticsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 