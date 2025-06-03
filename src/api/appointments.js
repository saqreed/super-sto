import { apiClient } from './client';

export const appointmentsAPI = {
  // Получить мои записи
  getMy: async (params) => {
    const response = await apiClient.get('/appointments/my', { params });
    return response.data;
  },

  // Получить запись по ID
  getById: async (id) => {
    const response = await apiClient.get(`/appointments/${id}`);
    return response.data;
  },

  // Создать новую запись
  create: async (appointmentData) => {
    const response = await apiClient.post('/appointments', appointmentData);
    return response.data;
  },

  // Обновить запись
  update: async (id, appointmentData) => {
    const response = await apiClient.put(`/appointments/${id}`, appointmentData);
    return response.data;
  },

  // Изменить статус записи
  updateStatus: async (id, status) => {
    const response = await apiClient.put(`/appointments/${id}/status`, { status });
    return response.data;
  },

  // Отменить запись
  cancel: async (id, reason) => {
    const response = await apiClient.put(`/appointments/${id}/status`, { 
      status: 'CANCELLED',
      cancellationReason: reason 
    });
    return response.data;
  },

  // Получить доступные слоты для записи
  getAvailableSlots: async (serviceId, masterId, date) => {
    const response = await apiClient.get('/appointments/available-slots', {
      params: { serviceId, masterId, date }
    });
    return response.data;
  },

  // Получить записи мастера
  getByMaster: async (masterId, params) => {
    const response = await apiClient.get(`/appointments/master/${masterId}`, { params });
    return response.data;
  },

  // Получить записи по дате
  getByDate: async (date) => {
    const response = await apiClient.get('/appointments/by-date', {
      params: { date }
    });
    return response.data;
  },
};

export default appointmentsAPI; 