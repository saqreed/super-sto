import { apiClient } from './client';

export const productsAPI = {
  // Получить каталог продуктов
  getAll: async (params) => {
    const response = await apiClient.get('/products', { params });
    return response.data;
  },

  // Получить продукт по ID
  getById: async (id) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  // Поиск продуктов
  search: async (query) => {
    const response = await apiClient.get(`/products/search`, {
      params: { query }
    });
    return response.data;
  },

  // Получить продукты по категории
  getByCategory: async (category) => {
    const response = await apiClient.get(`/products/category/${category}`);
    return response.data;
  },

  // Получить категории продуктов
  getCategories: async () => {
    const response = await apiClient.get('/products/categories');
    return response.data;
  },

  // Создать продукт (админ)
  create: async (productData) => {
    const response = await apiClient.post('/products', productData);
    return response.data;
  },

  // Обновить продукт (админ)
  update: async (id, productData) => {
    const response = await apiClient.put(`/products/${id}`, productData);
    return response.data;
  },

  // Удалить продукт (админ)
  delete: async (id) => {
    await apiClient.delete(`/products/${id}`);
  },

  // Проверить наличие продукта
  checkStock: async (id) => {
    const response = await apiClient.get(`/products/${id}/stock`);
    return response.data;
  },
};

export default productsAPI; 