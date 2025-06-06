import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Service, ServiceFilters } from '../../types';
import { servicesAPI } from '../../api/services';

interface ServicesState {
  services: Service[];
  categories: string[];
  loading: boolean;
  error: string | null;
}

const initialState: ServicesState = {
  services: [],
  categories: [],
  loading: false,
  error: null,
};

export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async (filters?: ServiceFilters) => {
    const response = await servicesAPI.getAll(filters);
    return response.data;
  }
);

export const fetchCategories = createAsyncThunk(
  'services/fetchCategories',
  async () => {
    const response = await servicesAPI.getCategories();
    return response.data;
  }
);

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action: PayloadAction<Service[]>) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки услуг';
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.categories = action.payload;
      });
  },
});

export const { clearError } = servicesSlice.actions;
export default servicesSlice.reducer; 