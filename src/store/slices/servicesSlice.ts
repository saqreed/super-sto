import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Service, ServiceStation } from '../../types';
import { servicesAPI } from '../../api/services';

interface ServicesState {
  services: Service[];
  serviceStations: ServiceStation[];
  categories: string[];
  loading: boolean;
  error: string | null;
}

const initialState: ServicesState = {
  services: [],
  serviceStations: [],
  categories: [],
  loading: false,
  error: null,
};

export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async (params?: { category?: string; search?: string }) => {
    try {
      if (params?.search) {
        return await servicesAPI.search(params.search);
      }
      if (params?.category) {
        return await servicesAPI.getByCategory(params.category);
      }
      return await servicesAPI.getAll();
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка загрузки услуг');
    }
  }
);

export const fetchServiceById = createAsyncThunk(
  'services/fetchServiceById',
  async (id: string) => {
    try {
      return await servicesAPI.getById(id);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка загрузки услуги');
    }
  }
);

export const fetchServiceCategories = createAsyncThunk(
  'services/fetchServiceCategories',
  async () => {
    try {
      return await servicesAPI.getCategories();
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка загрузки категорий');
    }
  }
);

// TODO: Добавить API для СТО когда будет готов
export const fetchServiceStations = createAsyncThunk(
  'services/fetchServiceStations',
  async () => {
    // Временные моковые данные пока нет API для СТО
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: '1',
        name: 'СуперСТО Центр',
        address: 'ул. Ленина, 123',
        coordinates: { lat: 55.7558, lng: 37.6176 },
        phone: '+7 (495) 123-45-67',
        workingHours: { start: '08:00', end: '20:00' },
        services: ['1', '2', '3'],
      },
      {
        id: '2',
        name: 'СуперСТО Север',
        address: 'ул. Северная, 45',
        coordinates: { lat: 55.7858, lng: 37.6376 },
        phone: '+7 (495) 234-56-78',
        workingHours: { start: '09:00', end: '19:00' },
        services: ['1', '2'],
      },
    ] as ServiceStation[];
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
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки услуг';
      })
      .addCase(fetchServiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceById.fulfilled, (state, action) => {
        state.loading = false;
        const existingIndex = state.services.findIndex(s => s.id === action.payload.id);
        if (existingIndex >= 0) {
          state.services[existingIndex] = action.payload;
        } else {
          state.services.push(action.payload);
        }
      })
      .addCase(fetchServiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки услуги';
      })
      .addCase(fetchServiceCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchServiceStations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceStations.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceStations = action.payload;
      })
      .addCase(fetchServiceStations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки СТО';
      });
  },
});

export const { clearError } = servicesSlice.actions;
export default servicesSlice.reducer; 