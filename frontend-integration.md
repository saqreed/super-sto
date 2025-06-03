# 🔗 Интеграция СуперСТО Backend с Frontend

## 🚀 Быстрый старт

### 1. Запуск Backend
```bash
cd backend
./mvnw spring-boot:run
```

**Backend будет доступен на:** `http://localhost:8080`

### 2. Проверка работы API
```bash
# Health check
curl http://localhost:8080/api/health

# Swagger UI
http://localhost:8080/swagger-ui.html
```

---

## 🔧 Конфигурация Frontend

### Environment файл (.env)
```env
# Backend API URL
REACT_APP_API_URL=http://localhost:8080/api

# WebSocket для чата (если используете)
REACT_APP_WS_URL=ws://localhost:8080/ws

# Другие настройки
REACT_APP_APP_NAME=СуперСТО
REACT_APP_VERSION=1.0.0
```

### API Client (axios)
```javascript
// src/api/client.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления JWT токена
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Интерцептор для обработки ошибок
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 📋 Основные API Endpoints

### 🔑 Аутентификация
```javascript
// src/api/auth.js
import { apiClient } from './client';

export const authAPI = {
  // Регистрация
  register: (userData) => 
    apiClient.post('/auth/register', userData),
  
  // Вход
  login: (credentials) => 
    apiClient.post('/auth/login', credentials),
  
  // Обновление токена
  refresh: (refreshToken) => 
    apiClient.post('/auth/refresh', { refreshToken }),
  
  // Выход
  logout: () => 
    apiClient.post('/auth/logout'),
};
```

### 👤 Пользователи
```javascript
// src/api/users.js
import { apiClient } from './client';

export const usersAPI = {
  // Получить профиль
  getProfile: () => 
    apiClient.get('/users/profile'),
  
  // Обновить профиль
  updateProfile: (profileData) => 
    apiClient.put('/users/profile', profileData),
  
  // Получить мастеров
  getMasters: () => 
    apiClient.get('/users/masters'),
};
```

### 🛠 Услуги
```javascript
// src/api/services.js
import { apiClient } from './client';

export const servicesAPI = {
  // Получить все услуги
  getAll: () => 
    apiClient.get('/services'),
  
  // Получить услугу по ID
  getById: (id) => 
    apiClient.get(`/services/${id}`),
  
  // Поиск услуг
  search: (query) => 
    apiClient.get(`/services/search?query=${query}`),
  
  // Создать услугу (admin)
  create: (serviceData) => 
    apiClient.post('/services', serviceData),
};
```

### 📅 Записи
```javascript
// src/api/appointments.js
import { apiClient } from './client';

export const appointmentsAPI = {
  // Мои записи
  getMy: () => 
    apiClient.get('/appointments/my'),
  
  // Создать запись
  create: (appointmentData) => 
    apiClient.post('/appointments', appointmentData),
  
  // Обновить статус
  updateStatus: (id, status) => 
    apiClient.put(`/appointments/${id}/status`, { status }),
  
  // Доступные слоты
  getAvailableSlots: (masterId, date) => 
    apiClient.get(`/appointments/available-slots/${masterId}?date=${date}`),
};
```

### 🛒 Продукты и заказы
```javascript
// src/api/products.js
import { apiClient } from './client';

export const productsAPI = {
  // Каталог продуктов
  getAll: () => 
    apiClient.get('/products'),
  
  // Поиск продуктов
  search: (query) => 
    apiClient.get(`/products/search?query=${query}`),
  
  // По категории
  getByCategory: (category) => 
    apiClient.get(`/products/category/${category}`),
};

// src/api/orders.js
export const ordersAPI = {
  // Мои заказы
  getMy: () => 
    apiClient.get('/orders/my'),
  
  // Создать заказ
  create: (orderData) => 
    apiClient.post('/orders', orderData),
};
```

### 💬 Чат
```javascript
// src/api/chat.js
import { apiClient } from './client';

export const chatAPI = {
  // Отправить сообщение
  sendMessage: (messageData) => 
    apiClient.post('/chat/send', messageData),
  
  // Получить переписку
  getConversation: (userId) => 
    apiClient.get(`/chat/conversation/${userId}`),
  
  // Непрочитанные сообщения
  getUnread: () => 
    apiClient.get('/chat/unread'),
  
  // Количество непрочитанных
  getUnreadCount: () => 
    apiClient.get('/chat/unread/count'),
};
```

### 🔔 Уведомления
```javascript
// src/api/notifications.js
import { apiClient } from './client';

export const notificationsAPI = {
  // Мои уведомления
  getMy: () => 
    apiClient.get('/notifications/my'),
  
  // Непрочитанные
  getUnread: () => 
    apiClient.get('/notifications/unread'),
  
  // Отметить как прочитанное
  markAsRead: (id) => 
    apiClient.put(`/notifications/${id}/read`),
  
  // Отметить все как прочитанные
  markAllAsRead: () => 
    apiClient.put('/notifications/read-all'),
};
```

---

## 🎯 Redux Store Integration

### Auth Slice
```javascript
// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../api/auth';

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      localStorage.setItem('accessToken', response.data.accessToken);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('accessToken'),
    isLoading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('accessToken');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.accessToken;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
```

---

## 🔄 Real-time Updates (WebSocket)

### Chat WebSocket
```javascript
// src/hooks/useWebSocket.js
import { useEffect, useRef } from 'react';

export const useWebSocket = (url, onMessage) => {
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(url);
    
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    return () => {
      ws.current?.close();
    };
  }, [url, onMessage]);

  const sendMessage = (message) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  };

  return { sendMessage };
};
```

---

## 🛡 Защищенные маршруты

```javascript
// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { token, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
```

---

## 📱 Примеры компонентов

### Форма входа
```javascript
// src/components/LoginForm.jsx
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../store/slices/authSlice';

export const LoginForm = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(credentials));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={credentials.email}
        onChange={(e) => setCredentials({...credentials, email: e.target.value})}
      />
      <input
        type="password"
        placeholder="Пароль"
        value={credentials.password}
        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
      />
      <button type="submit">Войти</button>
    </form>
  );
};
```

---

## 🔍 Тестирование интеграции

### Проверка соединения
```javascript
// src/utils/testConnection.js
import { apiClient } from '../api/client';

export const testBackendConnection = async () => {
  try {
    const response = await apiClient.get('/health');
    console.log('✅ Backend доступен:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Backend недоступен:', error);
    return false;
  }
};
```

---

## 🚀 Следующие шаги

1. **Запустите frontend**: `npm start`
2. **Проверьте соединение** с backend API
3. **Настройте переменные окружения**
4. **Имплементируйте аутентификацию**
5. **Добавьте основные экраны** (услуги, записи, профиль)

---

**🎯 Backend готов к интеграции!**  
**API Docs**: http://localhost:8080/swagger-ui.html  
**Health Check**: http://localhost:8080/api/health 