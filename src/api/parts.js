import { apiClient } from './client';

export const partsAPI = {
  // Получить все запчасти
  getAll: async (params) => {
    const response = await apiClient.get('/parts', { params });
    return response.data;
  },

  // Получить запчасть по ID
  getById: async (id) => {
    const response = await apiClient.get(`/parts/${id}`);
    return response.data;
  },

  // Поиск запчастей
  search: async (query) => {
    const response = await apiClient.get(`/parts/search?query=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Получить запчасти по категории
  getByCategory: async (category) => {
    const response = await apiClient.get(`/parts/category/${category}`);
    return response.data;
  },

  // Получить все категории запчастей
  getCategories: async () => {
    const response = await apiClient.get('/parts/categories');
    return response.data;
  },

  // Создать новую запчасть (только для админов)
  create: async (partData) => {
    const response = await apiClient.post('/parts', partData);
    return response.data;
  },

  // Обновить запчасть (только для админов)
  update: async (id, partData) => {
    const response = await apiClient.put(`/parts/${id}`, partData);
    return response.data;
  },

  // Удалить запчасть (только для админов)
  delete: async (id) => {
    await apiClient.delete(`/parts/${id}`);
  },

  // Проверить наличие запчасти
  checkAvailability: async (id, stationId) => {
    const response = await apiClient.get(`/parts/${id}/availability/${stationId}`);
    return response.data;
  },

  // Заказать запчасть
  order: async (orderData) => {
    const response = await apiClient.post('/parts/order', orderData);
    return response.data;
  },

  // Получить заказы запчастей
  getOrders: async (params) => {
    const response = await apiClient.get('/parts/orders', { params });
    return response.data;
  },
};

export default partsAPI; 