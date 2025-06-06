import client from './client';
import type { CreateOrderRequest } from '../types';

export const ordersAPI = {
  // Мои заказы
  getUserOrders: () => client.get('/orders/my'),
  
  // Все заказы (admin)
  getAll: () => client.get('/orders'),
  
  // Получить заказ по ID
  getById: (id: string) => client.get(`/orders/${id}`),
  
  // Создать заказ
  create: (orderData: CreateOrderRequest) => client.post('/orders', orderData),
  
  // Обновить статус заказа
  updateStatus: (id: string, status: string) => client.put(`/orders/${id}/status`, null, { params: { status } }),
  
  // Отменить заказ
  delete: (id: string) => client.delete(`/orders/${id}`),
}; 
