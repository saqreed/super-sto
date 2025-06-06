import client from './client';

export const analyticsAPI = {
  // Общая статистика дашборда
  getDashboardStats: () => client.get('/analytics/dashboard'),
  
  // Статистика доходов
  getRevenueStats: (startDate: string, endDate: string) => 
    client.get('/analytics/revenue', { params: { startDate, endDate } }),
  
  // Статистика услуг
  getServiceStats: () => client.get('/analytics/services'),
  
  // Статистика пользователей
  getUserStats: () => client.get('/analytics/users'),
};

export const reportsAPI = {
  // Отчет по записям
  generateAppointmentsReport: (startDate: string, endDate: string) =>
    client.get('/reports/appointments', { 
      params: { startDate, endDate },
      responseType: 'blob' 
    }),
  
  // Отчет по заказам
  generateOrdersReport: (startDate: string, endDate: string) =>
    client.get('/reports/orders', { 
      params: { startDate, endDate },
      responseType: 'blob' 
    }),
  
  // Отчет по доходам
  generateRevenueReport: (startDate: string, endDate: string) =>
    client.get('/reports/revenue', { 
      params: { startDate, endDate },
      responseType: 'blob' 
    }),
  
  // Отчет по клиентам
  getClientsReport: (params?: { period?: string }): Promise<{ data: any }> =>
    client.get('/reports/clients', { params }),
  
  // Отчет по пользователям
  generateUsersReport: () =>
    client.get('/reports/users', { responseType: 'blob' }),
}; 
