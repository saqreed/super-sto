import { apiClient } from './client';

export const ordersAPI = {
  // Получить мои заказы
  getMy: async (params) => {
    const response = await apiClient.get('/orders/my', { params });
    return response.data;
  },

  // Получить заказ по ID
  getById: async (id) => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },

  // Создать новый заказ
  create: async (orderData) => {
    const response = await apiClient.post('/orders', orderData);
    return response.data;
  },

  // Обновить заказ
  update: async (id, orderData) => {
    const response = await apiClient.put(`/orders/${id}`, orderData);
    return response.data;
  },

  // Изменить статус заказа
  updateStatus: async (id, status) => {
    const response = await apiClient.put(`/orders/${id}/status`, { status });
    return response.data;
  },

  // Отменить заказ
  cancel: async (id, reason) => {
    const response = await apiClient.put(`/orders/${id}/status`, { 
      status: 'CANCELLED',
      cancellationReason: reason 
    });
    return response.data;
  },

  // Оплатить заказ
  pay: async (id, paymentData) => {
    const response = await apiClient.post(`/orders/${id}/payment`, paymentData);
    return response.data;
  },

  // Получить статус оплаты
  getPaymentStatus: async (id) => {
    const response = await apiClient.get(`/orders/${id}/payment/status`);
    return response.data;
  },

  // Получить все заказы (админ)
  getAll: async (params) => {
    const response = await apiClient.get('/orders', { params });
    return response.data;
  },
};

export default ordersAPI; 