import { apiClient } from './client';

export const reportsAPI = {
  // Отчет по записям за период
  getAppointments: async (params) => {
    const response = await apiClient.get('/reports/appointments', { params });
    return response.data;
  },

  // Отчет по заказам
  getOrders: async (params) => {
    const response = await apiClient.get('/reports/orders', { params });
    return response.data;
  },

  // Отчет по доходам
  getRevenue: async (params) => {
    const response = await apiClient.get('/reports/revenue', { params });
    return response.data;
  },

  // Отчет по мастерам
  getMasters: async (params) => {
    const response = await apiClient.get('/reports/masters', { params });
    return response.data;
  },

  // Отчет по клиентам
  getClients: async (params) => {
    const response = await apiClient.get('/reports/clients', { params });
    return response.data;
  },

  // Отчет по услугам
  getServices: async (params) => {
    const response = await apiClient.get('/reports/services', { params });
    return response.data;
  },

  // Экспорт отчета в Excel
  exportToExcel: async (reportType, params) => {
    const response = await apiClient.get(`/reports/${reportType}/export/excel`, {
      params,
      responseType: 'blob',
    });
    return response.data;
  },

  // Экспорт отчета в PDF
  exportToPdf: async (reportType, params) => {
    const response = await apiClient.get(`/reports/${reportType}/export/pdf`, {
      params,
      responseType: 'blob',
    });
    return response.data;
  },
};

export default reportsAPI; 