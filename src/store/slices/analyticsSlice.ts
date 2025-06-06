import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { DashboardStats } from '../../types';
import { analyticsAPI } from '../../api/analytics';

interface AnalyticsState {
  dashboardStats: DashboardStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  dashboardStats: null,
  loading: false,
  error: null,
};

export const fetchDashboardStats = createAsyncThunk(
  'analytics/fetchDashboardStats',
  async () => {
    const response = await analyticsAPI.getDashboardStats();
    const backendData = response.data;
    
    // Мапинг полей между бэкендом и фронтендом
    const mappedData: DashboardStats = {
      totalClients: backendData.activeClients || 0,
      totalMasters: backendData.totalMasters || 0,
      todayAppointments: backendData.todayAppointments || 0,
      monthRevenue: backendData.monthRevenue || 0,
      monthGrowth: backendData.revenueGrowth || 0,
      pendingOrders: backendData.pendingOrders || 0,
      lowStockItems: backendData.lowStockProducts || 0,
      averageRating: backendData.averageServiceRating || 0,
      topServices: (backendData.topServices || []).map((service: any) => ({
        serviceId: service.serviceId,
        serviceName: service.serviceName,
        count: service.totalBookings || 0,
        revenue: service.totalRevenue || 0
      })),
      topMasters: (backendData.topMasters || []).map((master: any) => ({
        masterId: master.masterId,
        masterName: master.masterName,
        appointmentCount: master.totalAppointments || 0,
        averageRating: master.averageRating || 0,
        revenue: master.totalRevenue || 0
      }))
    };
    
    return mappedData;
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action: PayloadAction<DashboardStats>) => {
        state.loading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки аналитики';
      });
  },
});

export const { clearError } = analyticsSlice.actions;
export default analyticsSlice.reducer; 