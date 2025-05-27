import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, Part } from '../../types';

interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
  totalItems: 0,
};

const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + (item.part.price * item.quantity), 0);
  return { totalItems, totalAmount };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Part>) => {
      const existingItem = state.items.find(item => item.part.id === action.payload.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          part: action.payload,
          quantity: 1,
        });
      }
      
      const totals = calculateTotals(state.items);
      state.totalAmount = totals.totalAmount;
      state.totalItems = totals.totalItems;
    },
    
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.part.id !== action.payload);
      
      const totals = calculateTotals(state.items);
      state.totalAmount = totals.totalAmount;
      state.totalItems = totals.totalItems;
    },
    
    updateQuantity: (state, action: PayloadAction<{ partId: string; quantity: number }>) => {
      const item = state.items.find(item => item.part.id === action.payload.partId);
      
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter(item => item.part.id !== action.payload.partId);
        } else {
          item.quantity = action.payload.quantity;
        }
      }
      
      const totals = calculateTotals(state.items);
      state.totalAmount = totals.totalAmount;
      state.totalItems = totals.totalItems;
    },
    
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalItems = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer; 