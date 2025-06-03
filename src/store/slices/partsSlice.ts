import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Part } from '../../types';
import { partsAPI } from '../../api/parts';

interface PartsState {
  parts: Part[];
  filteredParts: Part[];
  categories: string[];
  brands: string[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: string;
  selectedBrand: string;
}

const initialState: PartsState = {
  parts: [],
  filteredParts: [],
  categories: [],
  brands: [],
  loading: false,
  error: null,
  searchQuery: '',
  selectedCategory: '',
  selectedBrand: '',
};

export const fetchParts = createAsyncThunk(
  'parts/fetchParts',
  async (params?: { category?: string; search?: string; brand?: string }) => {
    try {
      if (params?.search) {
        return await partsAPI.search(params.search);
      }
      if (params?.category) {
        return await partsAPI.getByCategory(params.category);
      }
      return await partsAPI.getAll(params);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка загрузки запчастей');
    }
  }
);

export const fetchPartById = createAsyncThunk(
  'parts/fetchPartById',
  async (id: string) => {
    try {
      return await partsAPI.getById(id);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка загрузки запчасти');
    }
  }
);

export const fetchPartCategories = createAsyncThunk(
  'parts/fetchCategories',
  async () => {
    try {
      return await partsAPI.getCategories();
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка загрузки категорий');
    }
  }
);

export const searchParts = createAsyncThunk(
  'parts/searchParts',
  async (query: string) => {
    try {
      return await partsAPI.search(query);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка поиска запчастей');
    }
  }
);

export const checkPartAvailability = createAsyncThunk(
  'parts/checkAvailability',
  async ({ partId, stationId }: { partId: string; stationId: string }) => {
    try {
      return await partsAPI.checkAvailability(partId, stationId);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка проверки наличия');
    }
  }
);

export const orderPart = createAsyncThunk(
  'parts/orderPart',
  async (orderData: any) => {
    try {
      return await partsAPI.order(orderData);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка заказа запчасти');
    }
  }
);

const partsSlice = createSlice({
  name: 'parts',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.filteredParts = filterParts(state.parts, state.searchQuery, state.selectedCategory, state.selectedBrand);
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.filteredParts = filterParts(state.parts, state.searchQuery, state.selectedCategory, state.selectedBrand);
    },
    setSelectedBrand: (state, action) => {
      state.selectedBrand = action.payload;
      state.filteredParts = filterParts(state.parts, state.searchQuery, state.selectedCategory, state.selectedBrand);
    },
    clearFilters: (state) => {
      state.searchQuery = '';
      state.selectedCategory = '';
      state.selectedBrand = '';
      state.filteredParts = state.parts;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchParts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParts.fulfilled, (state, action) => {
        state.loading = false;
        state.parts = action.payload;
        state.filteredParts = filterParts(action.payload, state.searchQuery, state.selectedCategory, state.selectedBrand);
        
        // Extract unique brands from parts
        const brands: string[] = [...new Set<string>(action.payload.map((part: Part) => part.brand))];
        state.brands = brands;
      })
      .addCase(fetchParts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки запчастей';
      })
      .addCase(fetchPartById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPartById.fulfilled, (state, action) => {
        state.loading = false;
        const existingIndex = state.parts.findIndex(p => p.id === action.payload.id);
        if (existingIndex >= 0) {
          state.parts[existingIndex] = action.payload;
        } else {
          state.parts.push(action.payload);
        }
        state.filteredParts = filterParts(state.parts, state.searchQuery, state.selectedCategory, state.selectedBrand);
      })
      .addCase(fetchPartById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки запчасти';
      })
      .addCase(fetchPartCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(searchParts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchParts.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredParts = action.payload;
      })
      .addCase(searchParts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка поиска запчастей';
      })
      .addCase(orderPart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(orderPart.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(orderPart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка заказа запчасти';
      });
  },
});

const filterParts = (parts: Part[], searchQuery: string, category: string, brand: string) => {
  return parts.filter(part => {
    const matchesSearch = !searchQuery || 
      part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.article.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !category || part.category === category;
    const matchesBrand = !brand || part.brand === brand;
    
    return matchesSearch && matchesCategory && matchesBrand;
  });
};

export const { setSearchQuery, setSelectedCategory, setSelectedBrand, clearFilters, clearError } = partsSlice.actions;
export default partsSlice.reducer; 