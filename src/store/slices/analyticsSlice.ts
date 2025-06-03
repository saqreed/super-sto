import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { analyticsAPI } from '../../api/analytics';

interface DashboardStats {
  totalClients: number;
  totalMasters: number;
  todayAppointments: number;
  monthRevenue: number;
  monthGrowth: number;
  pendingOrders: number;
  lowStockItems: number;
  averageRating: number;
  topServices: any[];
  topMasters: any[];
}

interface RevenueStats {
  totalRevenue: number;
  periodStart: string;
  periodEnd: string;
  dailyRevenue: number[];
  growthPercentage: number;
}

interface MasterPerformance {
  masterId: string;
  masterName: string;
  completedAppointments: number;
  revenue: number;
  averageRating: number;
  clientsServed: number;
}

interface ServicePopularity {
  serviceId: string;
  serviceName: string;
  appointmentCount: number;
  revenue: number;
  averageRating: number;
}

interface AnalyticsState {
  dashboardStats: DashboardStats | null;
  revenueStats: RevenueStats | null;
  topMasters: MasterPerformance[];
  topServices: ServicePopularity[];
  masterPerformance: MasterPerformance | null;
  loading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  dashboardStats: null,
  revenueStats: null,
  topMasters: [],
  topServices: [],
  masterPerformance: null,
  loading: false,
  error: null,
};

export const fetchDashboardStats = createAsyncThunk(
  'analytics/fetchDashboardStats',
  async () => {
    try {
      return await analyticsAPI.getDashboard();
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка загрузки статистики дашборда');
    }
  }
);

export const fetchRevenueStats = createAsyncThunk(
  'analytics/fetchRevenueStats',
  async (params: { startDate: string; endDate: string }) => {
    try {
      return await analyticsAPI.getRevenue(params);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка загрузки статистики доходов');
    }
  }
);

export const fetchTodayRevenue = createAsyncThunk(
  'analytics/fetchTodayRevenue',
  async () => {
    try {
      return await analyticsAPI.getTodayRevenue();
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка загрузки дневного дохода');
    }
  }
);

export const fetchMonthRevenue = createAsyncThunk(
  'analytics/fetchMonthRevenue',
  async () => {
    try {
      return await analyticsAPI.getMonthRevenue();
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка загрузки месячного дохода');
    }
  }
);

export const fetchYearRevenue = createAsyncThunk(
  'analytics/fetchYearRevenue',
  async () => {
    try {
      return await analyticsAPI.getYearRevenue();
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка загрузки годового дохода');
    }
  }
);

export const fetchTopMasters = createAsyncThunk(
  'analytics/fetchTopMasters',
  async (limit: number = 10) => {
    try {
      return await analyticsAPI.getTopMasters({ limit });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка загрузки топ мастеров');
    }
  }
);

export const fetchTopServices = createAsyncThunk(
  'analytics/fetchTopServices',
  async (limit: number = 10) => {
    try {
      return await analyticsAPI.getTopServices({ limit });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка загрузки топ услуг');
    }
  }
);

export const fetchMasterPerformance = createAsyncThunk(
  'analytics/fetchMasterPerformance',
  async (params: { masterId: string; startDate: string; endDate: string }) => {
    try {
      return await analyticsAPI.getMasterPerformance(params);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка загрузки производительности мастера');
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearStats: (state) => {
      state.dashboardStats = null;
      state.revenueStats = null;
      state.topMasters = [];
      state.topServices = [];
      state.masterPerformance = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки статистики дашборда';
      })
      .addCase(fetchRevenueStats.fulfilled, (state, action) => {
        state.revenueStats = action.payload;
      })
      .addCase(fetchTodayRevenue.fulfilled, (state, action) => {
        state.revenueStats = action.payload;
      })
      .addCase(fetchMonthRevenue.fulfilled, (state, action) => {
        state.revenueStats = action.payload;
      })
      .addCase(fetchYearRevenue.fulfilled, (state, action) => {
        state.revenueStats = action.payload;
      })
      .addCase(fetchTopMasters.fulfilled, (state, action) => {
        state.topMasters = action.payload;
      })
      .addCase(fetchTopServices.fulfilled, (state, action) => {
        state.topServices = action.payload;
      })
      .addCase(fetchMasterPerformance.fulfilled, (state, action) => {
        state.masterPerformance = action.payload;
      });
  },
});

export const { clearError, clearStats } = analyticsSlice.actions;
export default analyticsSlice.reducer; 