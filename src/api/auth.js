import { apiClient } from './client';

export const authAPI = {
  // Регистрация нового пользователя
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  // Вход в систему
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    
    // Сохраняем токены в localStorage
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    if (response.data.refreshToken) {
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    
    return response.data;
  },

  // Обновление токена
  refresh: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('Refresh token не найден');
    }

    const response = await apiClient.post('/auth/refresh', { refreshToken });
    
    // Обновляем токены
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    if (response.data.refreshToken) {
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    
    return response.data;
  },

  // Выход из системы
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.warn('Ошибка при выходе:', error);
    } finally {
      // Очищаем токены независимо от результата
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },

  // Проверка валидности токена
  validateToken: async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return false;
    }

    try {
      await apiClient.get('/users/profile');
      return true;
    } catch (error) {
      if (error.response?.status === 401) {
        // Попробуем обновить токен
        try {
          await authAPI.refresh();
          return true;
        } catch (refreshError) {
          return false;
        }
      }
      return false;
    }
  },
};

export default authAPI; 