import { apiClient } from './client';

export const servicesAPI = {
  // Получить все активные услуги
  getAll: async () => {
    const response = await apiClient.get('/services');
    return response.data;
  },

  // Получить услугу по ID
  getById: async (id) => {
    const response = await apiClient.get(`/services/${id}`);
    return response.data;
  },

  // Поиск услуг
  search: async (query) => {
    const response = await apiClient.get(`/services/search?query=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Получить услуги по категории
  getByCategory: async (category) => {
    const response = await apiClient.get(`/services/category/${category}`);
    return response.data;
  },

  // Получить все категории услуг
  getCategories: async () => {
    const response = await apiClient.get('/services/categories');
    return response.data;
  },

  // Создать новую услугу (только для админов)
  create: async (serviceData) => {
    const response = await apiClient.post('/services', serviceData);
    return response.data;
  },

  // Обновить услугу (только для админов)
  update: async (id, serviceData) => {
    const response = await apiClient.put(`/services/${id}`, serviceData);
    return response.data;
  },

  // Удалить услугу (только для админов)
  delete: async (id) => {
    await apiClient.delete(`/services/${id}`);
  },

  // Получить статистику по услуге
  getStats: async (id) => {
    const response = await apiClient.get(`/services/${id}/stats`);
    return response.data;
  },
};

export default servicesAPI; 