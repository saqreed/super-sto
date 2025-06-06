import axios from 'axios';

const apiBaseURL = process.env.REACT_APP_API_URL || 'http://localhost:8082/api';
console.log('🔧 API Base URL:', apiBaseURL);

const client = axios.create({
  baseURL: apiBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления JWT токена
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  console.log('🔑 Request interceptor - URL:', config.url, 'Token:', token ? `${token.substring(0, 20)}...` : 'No token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('✅ Added Authorization header for:', config.url);
  } else {
    console.log('❌ No token found for:', config.url);
  }
  return config;
});

// Интерцептор для обработки ошибок
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log('❌ Response error:', error.response?.status, error.config?.url);
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('🔄 Attempting token refresh...');
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          console.log('🔄 Sending refresh request...');
          const response = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:8082/api'}/auth/refresh`, {
            refreshToken
          });
          
          console.log('✅ Refresh response:', response.data);
          // Backend возвращает обернутый ответ: { success: true, data: { accessToken, refreshToken } }
          const authData = response.data.data || response.data;
          const { accessToken, refreshToken: newRefreshToken } = authData;
          
          console.log('💾 Saving new tokens...', {
            accessToken: accessToken ? `${accessToken.substring(0, 20)}...` : 'No token',
            refreshToken: newRefreshToken ? `${newRefreshToken.substring(0, 20)}...` : 'No token'
          });
          
          localStorage.setItem('accessToken', accessToken);
          if (newRefreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken);
          }
          
          // Обязательно обновляем заголовок в оригинальном запросе
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          console.log('🔄 Retrying original request with new token:', originalRequest.url);
          return client(originalRequest);
        } catch (refreshError) {
          console.log('❌ Refresh failed:', refreshError);
          console.log('🗑️ API Interceptor clearing tokens - refresh failed', new Error().stack);
          // Refresh token также невалиден
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      } else {
        console.log('❌ No refresh token found');
        console.log('🗑️ API Interceptor clearing tokens - no refresh token', new Error().stack);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default client; 
