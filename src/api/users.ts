import client from './client';
import type { User } from '../types';

export const usersAPI = {
  // Получить профиль
  getProfile: () => client.get('/users/profile'),
  
  // Обновить профиль
  updateProfile: (profileData: Partial<User>) => 
    client.put('/users/profile', profileData),
  
  // Получить мастеров
  getMasters: () => client.get('/users/masters'),
  
  // Получить всех пользователей (admin)
  getAllUsers: (params?: { role?: string; search?: string }) => 
    client.get('/users', { params }),
  
  // Активировать/деактивировать пользователя (admin)
  toggleUserStatus: (userId: string) => 
    client.patch(`/users/${userId}/toggle-status`),
}; 
