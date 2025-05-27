import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AnalyticsData, RevenueData, ServiceAnalytics, MasterAnalytics, CustomerAnalytics, InventoryAnalytics } from '../../types';

interface AnalyticsState {
  data: AnalyticsData | null;
  loading: boolean;
  error: string | null;
  dateRange: {
    from: Date;
    to: Date;
  };
}

const initialState: AnalyticsState = {
  data: null,
  loading: false,
  error: null,
  dateRange: {
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  },
};

// Mock analytics data
const mockAnalyticsData: AnalyticsData = {
  revenue: {
    daily: [12000, 15000, 8000, 22000, 18000, 25000, 20000],
    weekly: [120000, 135000, 98000, 156000],
    monthly: [450000, 520000, 380000, 620000, 580000, 490000],
    yearly: [5800000, 6200000],
    total: 6200000,
    growth: 12.5,
  },
  services: {
    mostPopular: [
      { serviceId: '1', serviceName: 'Замена масла', count: 156, percentage: 35.2 },
      { serviceId: '2', serviceName: 'Диагностика', count: 98, percentage: 22.1 },
      { serviceId: '3', serviceName: 'Ремонт тормозов', count: 67, percentage: 15.1 },
      { serviceId: '4', serviceName: 'Шиномонтаж', count: 45, percentage: 10.2 },
      { serviceId: '5', serviceName: 'Развал-схождение', count: 34, percentage: 7.7 },
    ],
    revenue: [
      { serviceId: '1', serviceName: 'Замена масла', revenue: 468000, count: 156, averagePrice: 3000 },
      { serviceId: '2', serviceName: 'Диагностика', revenue: 294000, count: 98, averagePrice: 3000 },
      { serviceId: '3', serviceName: 'Ремонт тормозов', revenue: 536000, count: 67, averagePrice: 8000 },
    ],
    completion: [
      { serviceId: '1', serviceName: 'Замена масла', completed: 156, cancelled: 4, completionRate: 97.5 },
      { serviceId: '2', serviceName: 'Диагностика', completed: 98, cancelled: 2, completionRate: 98.0 },
      { serviceId: '3', serviceName: 'Ремонт тормозов', completed: 67, cancelled: 8, completionRate: 89.3 },
    ],
  },
  masters: [
    {
      id: '2',
      name: 'Алексей Мастеров',
      completedJobs: 89,
      averageRating: 4.8,
      revenue: 712000,
      efficiency: 95.5,
      customerSatisfaction: 96.2,
    },
    {
      id: '3',
      name: 'Сергей Автомеханик',
      completedJobs: 76,
      averageRating: 4.6,
      revenue: 608000,
      efficiency: 92.1,
      customerSatisfaction: 94.8,
    },
  ],
  customers: {
    totalCustomers: 1247,
    newCustomers: 89,
    returningCustomers: 156,
    averageOrderValue: 4500,
    customerLifetimeValue: 18500,
    churnRate: 8.2,
  },
  inventory: {
    totalItems: 2456,
    lowStockItems: 23,
    outOfStockItems: 5,
    topSellingParts: [
      { partId: '1', partName: 'Масло моторное 5W-30', quantitySold: 234, revenue: 351000 },
      { partId: '2', partName: 'Фильтр масляный', quantitySold: 189, revenue: 94500 },
      { partId: '3', partName: 'Тормозные колодки', quantitySold: 67, revenue: 201000 },
    ],
    inventoryValue: 3450000,
    turnoverRate: 4.2,
  },
};

export const fetchAnalytics = createAsyncThunk(
  'analytics/fetchAnalytics',
  async (params: { from: Date; to: Date; type?: 'overview' | 'revenue' | 'services' | 'masters' | 'customers' | 'inventory' }) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // В реальном приложении здесь будет API вызов с фильтрацией по датам
    return mockAnalyticsData;
  }
);

export const fetchRevenueData = createAsyncThunk(
  'analytics/fetchRevenueData',
  async (params: { from: Date; to: Date; period: 'daily' | 'weekly' | 'monthly' | 'yearly' }) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const revenueData: RevenueData = {
      ...mockAnalyticsData.revenue,
      // В реальном приложении данные будут фильтроваться по периоду
    };
    
    return revenueData;
  }
);

export const fetchServiceAnalytics = createAsyncThunk(
  'analytics/fetchServiceAnalytics',
  async (params: { from: Date; to: Date }) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockAnalyticsData.services;
  }
);

export const fetchMasterAnalytics = createAsyncThunk(
  'analytics/fetchMasterAnalytics',
  async (params: { from: Date; to: Date; masterId?: string }) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let masters = mockAnalyticsData.masters;
    
    if (params.masterId) {
      masters = masters.filter((m: MasterAnalytics) => m.id === params.masterId);
    }
    
    return masters;
  }
);

export const fetchCustomerAnalytics = createAsyncThunk(
  'analytics/fetchCustomerAnalytics',
  async (params: { from: Date; to: Date }) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockAnalyticsData.customers;
  }
);

export const fetchInventoryAnalytics = createAsyncThunk(
  'analytics/fetchInventoryAnalytics',
  async (params: { from: Date; to: Date }) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockAnalyticsData.inventory;
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setDateRange: (state, action) => {
      state.dateRange = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки аналитики';
      })
      .addCase(fetchRevenueData.fulfilled, (state, action) => {
        if (state.data) {
          state.data.revenue = action.payload;
        }
      })
      .addCase(fetchServiceAnalytics.fulfilled, (state, action) => {
        if (state.data) {
          state.data.services = action.payload;
        }
      })
      .addCase(fetchMasterAnalytics.fulfilled, (state, action) => {
        if (state.data) {
          state.data.masters = action.payload;
        }
      })
      .addCase(fetchCustomerAnalytics.fulfilled, (state, action) => {
        if (state.data) {
          state.data.customers = action.payload;
        }
      })
      .addCase(fetchInventoryAnalytics.fulfilled, (state, action) => {
        if (state.data) {
          state.data.inventory = action.payload;
        }
      });
  },
});

export const { setDateRange, clearError } = analyticsSlice.actions;
export default analyticsSlice.reducer; 