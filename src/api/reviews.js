import { apiClient } from './client';

export const reviewsAPI = {
  // Получить все отзывы
  getAll: async (params) => {
    const response = await apiClient.get('/reviews', { params });
    return response.data;
  },

  // Получить отзыв по ID
  getById: async (id) => {
    const response = await apiClient.get(`/reviews/${id}`);
    return response.data;
  },

  // Создать новый отзыв
  create: async (reviewData) => {
    const response = await apiClient.post('/reviews', reviewData);
    return response.data;
  },

  // Ответить на отзыв
  respond: async (reviewId, responseData) => {
    const response = await apiClient.post(`/reviews/${reviewId}/response`, responseData);
    return response.data;
  },

  // Получить отзывы по мастеру
  getByMaster: async (masterId) => {
    const response = await apiClient.get(`/reviews/master/${masterId}`);
    return response.data;
  },

  // Получить отзывы по СТО
  getByStation: async (stationId) => {
    const response = await apiClient.get(`/reviews/station/${stationId}`);
    return response.data;
  },

  // Получить отзывы клиента
  getByClient: async (clientId) => {
    const response = await apiClient.get(`/reviews/client/${clientId}`);
    return response.data;
  },

  // Загрузить фото к отзыву
  uploadPhoto: async (reviewId, photoFile) => {
    const formData = new FormData();
    formData.append('photo', photoFile);
    const response = await apiClient.post(`/reviews/${reviewId}/photos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default reviewsAPI; 