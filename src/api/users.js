import { apiClient } from './client';

export const usersAPI = {
  // Получить профиль текущего пользователя
  getProfile: async () => {
    const response = await apiClient.get('/users/profile');
    return response.data;
  },

  // Обновить профиль
  updateProfile: async (profileData) => {
    const response = await apiClient.put('/users/profile', profileData);
    return response.data;
  },

  // Получить всех мастеров
  getMasters: async () => {
    const response = await apiClient.get('/users/masters');
    return response.data;
  },
};

export default usersAPI; 