import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import servicesSlice from './slices/servicesSlice';
import requestsSlice from './slices/requestsSlice';
import partsSlice from './slices/partsSlice';
import cartSlice from './slices/cartSlice';
import notificationsSlice from './slices/notificationsSlice';
import chatSlice from './slices/chatSlice';
import reviewsSlice from './slices/reviewsSlice';
import loyaltySlice from './slices/loyaltySlice';
import analyticsSlice from './slices/analyticsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    services: servicesSlice,
    requests: requestsSlice,
    parts: partsSlice,
    cart: cartSlice,
    notifications: notificationsSlice,
    chat: chatSlice,
    reviews: reviewsSlice,
    loyalty: loyaltySlice,
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