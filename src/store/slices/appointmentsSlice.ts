import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Appointment, CreateAppointmentRequest, AppointmentFilters } from '../../types';
import { appointmentsAPI } from '../../api/appointments';

interface AppointmentsState {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
}

const initialState: AppointmentsState = {
  appointments: [],
  loading: false,
  error: null,
};

export const fetchUserAppointments = createAsyncThunk(
  'appointments/fetchMy',
  async (filters?: AppointmentFilters) => {
    const response = await appointmentsAPI.getUserAppointments();
    return response.data;
  }
);

export const createAppointment = createAsyncThunk(
  'appointments/create',
  async (appointmentData: CreateAppointmentRequest) => {
    const response = await appointmentsAPI.create(appointmentData);
    return response.data;
  }
);

export const updateAppointmentStatus = createAsyncThunk(
  'appointments/updateStatus',
  async ({ id, status }: { id: string; status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' }) => {
    const response = await appointmentsAPI.update(id, { status });
    return response.data;
  }
);

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAppointments.fulfilled, (state, action: PayloadAction<Appointment[]>) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchUserAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки записей';
      })
      .addCase(createAppointment.fulfilled, (state, action: PayloadAction<Appointment>) => {
        state.appointments.unshift(action.payload);
      })
      .addCase(updateAppointmentStatus.fulfilled, (state, action: PayloadAction<Appointment>) => {
        const index = state.appointments.findIndex(app => app.id === action.payload.id);
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
      });
  },
});

export const { clearError } = appointmentsSlice.actions;
export default appointmentsSlice.reducer; 