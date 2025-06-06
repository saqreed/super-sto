import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { Product, ProductFilters, CartItem } from '../../types';
import { productsAPI } from '../../api/products';
import type { RootState } from '../store';

interface ProductsState {
  products: Product[];
  categories: string[];
  cart: CartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  categories: [],
  cart: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters: ProductFilters | undefined, { rejectWithValue }) => {
    try {
      const response = await productsAPI.getAll(filters);
      // Бэкенд возвращает обернутый ответ: { success: true, data: Product[] }
      const products = response.data.data || response.data;
      return Array.isArray(products) ? products : [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки продуктов');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productsAPI.getCategories();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки категорий');
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: Product; quantity: number }>) => {
      const { product, quantity } = action.payload;
      const existingItemIndex = state.cart.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex >= 0) {
        state.cart[existingItemIndex].quantity += quantity;
      } else {
        state.cart.push({ product, quantity });
      }
    },
    
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cart = state.cart.filter(item => item.product.id !== action.payload);
    },
    
    updateCartQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      const itemIndex = state.cart.findIndex(item => item.product.id === productId);
      
      if (itemIndex >= 0) {
        if (quantity <= 0) {
          state.cart.splice(itemIndex, 1);
        } else {
          state.cart[itemIndex].quantity = quantity;
        }
      }
    },
    
    clearCart: (state) => {
      state.cart = [];
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Categories
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

// Selectors
export const selectProducts = (state: RootState) => state.products.products;
export const selectProductsLoading = (state: RootState) => state.products.loading;
export const selectProductsError = (state: RootState) => state.products.error;
export const selectCategories = (state: RootState) => state.products.categories;
export const selectCart = (state: RootState) => state.products.cart;

// Мемоизированные селекторы
export const selectCartTotal = createSelector(
  [selectCart],
  (cart) => cart.reduce((total, item) => total + (item.product.price * item.quantity), 0)
);

export const selectCartItemsCount = createSelector(
  [selectCart],
  (cart) => cart.reduce((total, item) => total + item.quantity, 0)
);

export const selectProductById = createSelector(
  [selectProducts, (state: RootState, productId: string) => productId],
  (products, productId) => products.find(product => product.id === productId)
);

export const selectProductsByCategory = createSelector(
  [selectProducts, (state: RootState, category: string) => category],
  (products, category) => products.filter(product => product.category === category)
);

export const selectAvailableProducts = createSelector(
  [selectProducts],
  (products) => products.filter(product => product.isActive && product.stockQuantity > 0)
);

export const { addToCart, removeFromCart, updateCartQuantity, clearCart, clearError } = productsSlice.actions;
export default productsSlice.reducer; 