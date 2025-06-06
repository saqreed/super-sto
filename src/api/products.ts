import client from './client';
import type { Product, ProductFilters } from '../types';

export const productsAPI = {
  // Каталог продуктов
  getAll: (filters?: ProductFilters) => client.get('/products', { params: filters }),
  
  // Получить продукт по ID
  getById: (id: string) => client.get(`/products/${id}`),
  
  // Поиск продуктов
  search: (query: string): Promise<{ data: Product[] }> =>
    client.get(`/products/search`, { params: { query } }),
  
  // Продукты по категории
  getByCategory: (category: string): Promise<{ data: Product[] }> =>
    client.get(`/products/category/${category}`),
  
  // Получить категории
  getCategories: () => client.get('/products/categories'),
  
  // Создать продукт (admin)
  create: (productData: Partial<Product>) => client.post('/products', productData),
  
  // Обновить продукт (admin)
  update: (id: string, productData: Partial<Product>) => client.put(`/products/${id}`, productData),
  
  // Удалить продукт (admin)
  delete: (id: string) => client.delete(`/products/${id}`),
}; 
