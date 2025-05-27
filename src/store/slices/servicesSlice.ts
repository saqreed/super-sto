import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Service, ServiceStation } from '../../types';

interface ServicesState {
  services: Service[];
  serviceStations: ServiceStation[];
  loading: boolean;
  error: string | null;
}

const initialState: ServicesState = {
  services: [],
  serviceStations: [],
  loading: false,
  error: null,
};

// Мокаем данные
const mockServices: Service[] = [
  {
    id: '1',
    name: 'Замена масла',
    description: 'Замена моторного масла и масляного фильтра',
    price: 2500,
    duration: 60,
    category: 'Техническое обслуживание',
  },
  {
    id: '2',
    name: 'Диагностика двигателя',
    description: 'Компьютерная диагностика двигателя',
    price: 1500,
    duration: 45,
    category: 'Диагностика',
  },
  {
    id: '3',
    name: 'Замена тормозных колодок',
    description: 'Замена передних или задних тормозных колодок',
    price: 3500,
    duration: 90,
    category: 'Тормозная система',
  },
];

const mockServiceStations: ServiceStation[] = [
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
];

export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockServices;
  }
);

export const fetchServiceStations = createAsyncThunk(
  'services/fetchServiceStations',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockServiceStations;
  }
);

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки услуг';
      })
      .addCase(fetchServiceStations.pending, (state) => {
        state.loading = true;
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

export default servicesSlice.reducer; 