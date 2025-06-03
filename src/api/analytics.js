import { apiClient } from './client';

export const analyticsAPI = {
  // Получить общую статистику дашборда
  getDashboard: async () => {
    const response = await apiClient.get('/analytics/dashboard');
    return response.data;
  },

  // Статистика доходов
  getRevenue: async (params) => {
    const response = await apiClient.get('/analytics/revenue', { params });
    return response.data;
  },

  // Доход за сегодня
  getTodayRevenue: async () => {
    const response = await apiClient.get('/analytics/revenue/today');
    return response.data;
  },

  // Доход за месяц
  getMonthRevenue: async () => {
    const response = await apiClient.get('/analytics/revenue/month');
    return response.data;
  },

  // Доход за год
  getYearRevenue: async () => {
    const response = await apiClient.get('/analytics/revenue/year');
    return response.data;
  },

  // Топ мастера по производительности
  getTopMasters: async (params) => {
    const response = await apiClient.get('/analytics/masters/top', { params });
    return response.data;
  },

  // Производительность конкретного мастера
  getMasterPerformance: async (params) => {
    const { masterId, startDate, endDate } = params;
    const response = await apiClient.get(`/analytics/masters/${masterId}/performance`, {
      params: { startDate, endDate }
    });
    return response.data;
  },

  // Топ услуги
  getTopServices: async (params) => {
    const response = await apiClient.get('/analytics/services/top', { params });
    return response.data;
  },

  // Статистика по услугам
  getServicesStats: async (params) => {
    const response = await apiClient.get('/analytics/services', { params });
    return response.data;
  },

  // Статистика клиентов
  getClientsStats: async (params) => {
    const response = await apiClient.get('/analytics/clients', { params });
    return response.data;
  },

  // Конверсия и воронка продаж
  getConversionStats: async (params) => {
    const response = await apiClient.get('/analytics/conversion', { params });
    return response.data;
  },

  // Статистика по времени
  getTimeStats: async (params) => {
    const response = await apiClient.get('/analytics/time', { params });
    return response.data;
  },
};

export default analyticsAPI; 