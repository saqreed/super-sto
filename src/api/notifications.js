import { apiClient } from './client';

export const notificationsAPI = {
  // Получить мои уведомления
  getMy: async (params) => {
    const response = await apiClient.get('/notifications/my', { params });
    return response.data;
  },

  // Получить непрочитанные уведомления
  getUnread: async () => {
    const response = await apiClient.get('/notifications/unread');
    return response.data;
  },

  // Отметить уведомление как прочитанное
  markAsRead: async (id) => {
    const response = await apiClient.put(`/notifications/${id}/read`);
    return response.data;
  },

  // Отметить все уведомления как прочитанные
  markAllAsRead: async () => {
    const response = await apiClient.put('/notifications/read-all');
    return response.data;
  },

  // Получить количество непрочитанных уведомлений
  getUnreadCount: async () => {
    const response = await apiClient.get('/notifications/unread/count');
    return response.data;
  },

  // Удалить уведомление
  delete: async (id) => {
    await apiClient.delete(`/notifications/${id}`);
  },

  // Очистить все уведомления
  deleteAll: async () => {
    await apiClient.delete('/notifications/all');
  },

  // Настройки уведомлений
  getSettings: async () => {
    const response = await apiClient.get('/notifications/settings');
    return response.data;
  },

  // Обновить настройки уведомлений
  updateSettings: async (settings) => {
    const response = await apiClient.put('/notifications/settings', settings);
    return response.data;
  },
};

export default notificationsAPI; 