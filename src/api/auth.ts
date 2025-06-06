import client from './client';
import type { LoginRequest, RegisterRequest } from '../types';

export const authAPI = {
  // Регистрация
  register: async (userData: RegisterRequest) => {
    const response = await client.post('/auth/register', userData);
    return response.data;
  },
  
  // Вход
  login: async (credentials: LoginRequest) => {
    console.log('🔄 authAPI.login - sending request with:', credentials);
    const response = await client.post('/auth/login', credentials);
    console.log('✅ authAPI.login - received response:', response);
    console.log('✅ authAPI.login - response.data:', response.data);
    return response.data;
  },
  
  // Обновление токена
  refreshToken: async (refreshToken: string) => {
    const response = await client.post('/auth/refresh', { refreshToken });
    return response.data;
  },
  
  // Выход
  logout: async () => {
    const response = await client.post('/auth/logout');
    return response.data;
  },
}; 
