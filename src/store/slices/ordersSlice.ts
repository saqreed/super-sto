import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Order, CreateOrderRequest } from '../../types';
import { ordersAPI } from '../../api/orders';

interface OrdersState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  loading: false,
  error: null,
};

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchMy',
  async () => {
    const response = await ordersAPI.getUserOrders();
    return response.data;
  }
);

export const createOrder = createAsyncThunk(
  'orders/create',
  async (orderData: CreateOrderRequest) => {
    const response = await ordersAPI.create(orderData);
    return response.data;
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки заказов';
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.orders.unshift(action.payload);
      });
  },
});

export const { clearError } = ordersSlice.actions;
export default ordersSlice.reducer; 