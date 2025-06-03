import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import servicesReducer from './slices/servicesSlice';
import requestsReducer from './slices/requestsSlice';
import reviewsReducer from './slices/reviewsSlice';
import partsReducer from './slices/partsSlice';
import notificationsReducer from './slices/notificationsSlice';
import cartReducer from './slices/cartSlice';
import analyticsReducer from './slices/analyticsSlice';
import chatReducer from './slices/chatSlice';
import loyaltyReducer from './slices/loyaltySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    services: servicesReducer,
    requests: requestsReducer,
    reviews: reviewsReducer,
    parts: partsReducer,
    notifications: notificationsReducer,
    cart: cartReducer,
    analytics: analyticsReducer,
    chat: chatReducer,
    loyalty: loyaltyReducer,
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