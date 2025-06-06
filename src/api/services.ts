import client from './client';
import type { Service, ServiceFilters } from '../types';

export const servicesAPI = {
  // Получить все активные услуги
  getAll: (filters?: ServiceFilters) => client.get('/services', { params: filters }),
  
  // Получить услугу по ID
  getById: (id: string) => client.get(`/services/${id}`),
  
  // Поиск услуг
  search: (query: string): Promise<{ data: Service[] }> =>
    client.get(`/services/search`, { params: { query } }),
  
  // Получить услуги по категории
  getByCategory: (category: string): Promise<{ data: Service[] }> =>
    client.get(`/services/category/${category}`),
  
  // Создать услугу (admin)
  create: (serviceData: Partial<Service>) => client.post('/services', serviceData),
  
  // Обновить услугу (admin)
  update: (id: string, serviceData: Partial<Service>) => client.put(`/services/${id}`, serviceData),
  
  // Удалить услугу (admin)
  delete: (id: string) => client.delete(`/services/${id}`),
  
  // Получить категории услуг
  getCategories: () => client.get('/services/categories'),
}; 
