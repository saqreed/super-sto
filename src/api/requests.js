import { apiClient } from './client';

export const requestsAPI = {
  // Получить все заявки
  getAll: async (params) => {
    const response = await apiClient.get('/requests', { params });
    return response.data;
  },

  // Получить заявку по ID
  getById: async (id) => {
    const response = await apiClient.get(`/requests/${id}`);
    return response.data;
  },

  // Создать новую заявку
  create: async (requestData) => {
    const response = await apiClient.post('/requests', requestData);
    return response.data;
  },

  // Обновить заявку
  update: async (id, requestData) => {
    const response = await apiClient.put(`/requests/${id}`, requestData);
    return response.data;
  },

  // Принять заявку мастером
  accept: async (id, masterId) => {
    const response = await apiClient.post(`/requests/${id}/accept`, { masterId });
    return response.data;
  },

  // Начать выполнение заявки
  start: async (id) => {
    const response = await apiClient.post(`/requests/${id}/start`);
    return response.data;
  },

  // Завершить заявку
  complete: async (id, completionData) => {
    const response = await apiClient.post(`/requests/${id}/complete`, completionData);
    return response.data;
  },

  // Отменить заявку
  cancel: async (id, reason) => {
    const response = await apiClient.post(`/requests/${id}/cancel`, { reason });
    return response.data;
  },

  // Получить заявки клиента
  getByClient: async (clientId) => {
    const response = await apiClient.get(`/requests/client/${clientId}`);
    return response.data;
  },

  // Получить заявки мастера
  getByMaster: async (masterId) => {
    const response = await apiClient.get(`/requests/master/${masterId}`);
    return response.data;
  },

  // Получить заявки по СТО
  getByStation: async (stationId) => {
    const response = await apiClient.get(`/requests/station/${stationId}`);
    return response.data;
  },

  // Обновить статус заявки
  updateStatus: async (id, status) => {
    const response = await apiClient.put(`/requests/${id}/status`, { status });
    return response.data;
  },

  // Добавить комментарий к заявке
  addComment: async (id, comment) => {
    const response = await apiClient.post(`/requests/${id}/comments`, { comment });
    return response.data;
  },

  // Загрузить фото к заявке
  uploadPhoto: async (requestId, photoFile) => {
    const formData = new FormData();
    formData.append('photo', photoFile);
    const response = await apiClient.post(`/requests/${requestId}/photos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default requestsAPI; 