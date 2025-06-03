import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Part } from '../../types';

interface CartItem {
  part: Part;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  totalAmount: number;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  totalAmount: 0,
};

const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.part.price * item.quantity), 0);
  return { totalItems, totalPrice };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ part: Part; quantity?: number }>) => {
      const { part, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.part.id === part.id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ part, quantity });
      }

      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
      state.totalAmount = totals.totalPrice;
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.part.id !== action.payload);
      
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
      state.totalAmount = totals.totalPrice;
    },
    updateQuantity: (state, action: PayloadAction<{ partId: string; quantity: number }>) => {
      const { partId, quantity } = action.payload;
      const item = state.items.find(item => item.part.id === partId);

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.part.id !== partId);
        } else {
          item.quantity = quantity;
        }
      }

      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
      state.totalAmount = totals.totalPrice;
    },
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
      state.totalAmount = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer; 