# 🚗 СуперСТО - API Документация

## 📝 Обзор

СуперСТО API - это RESTful веб-сервис для управления автосервисом с полной функциональностью:
- Аутентификация и авторизация
- Система записей и заказов
- Чат и уведомления
- Аналитика и отчеты
- Программа лояльности

**Базовый URL**: `http://localhost:8080/api`

## 🔐 Аутентификация

Система использует JWT токены для аутентификации.

### Заголовки запросов
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Роли пользователей
- **CLIENT** - Клиент автосервиса
- **MASTER** - Мастер/механик
- **ADMIN** - Администратор

---

## 📋 Endpoints

### 🔑 Аутентификация
#### POST `/auth/register`
Регистрация нового пользователя

**Запрос:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "Имя",
  "lastName": "Фамилия",
  "phone": "+7-900-123-45-67",
  "role": "CLIENT"
}
```

**Ответ 201:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400
}
```

#### POST `/auth/login`
Вход в систему

**Запрос:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### POST `/auth/refresh`
Обновление токена

**Запрос:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiJ9..."
}
```

---

### 👤 Пользователи
#### GET `/users/profile`
Получить профиль текущего пользователя

**Ответ 200:**
```json
{
  "id": "user-id",
  "email": "user@example.com",
  "firstName": "Имя",
  "lastName": "Фамилия",
  "phone": "+7-900-123-45-67",
  "role": "CLIENT",
  "loyaltyLevel": "BRONZE",
  "loyaltyPoints": 150,
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00"
}
```

#### PUT `/users/profile`
Обновить профиль

**Запрос:**
```json
{
  "firstName": "Новое имя",
  "lastName": "Новая фамилия",
  "phone": "+7-900-000-00-00"
}
```

---

### 🛠 Услуги
#### GET `/services`
Получить список активных услуг

**Параметры запроса:**
- `category` (optional) - Категория услуги
- `search` (optional) - Поиск по названию

**Ответ 200:**
```json
[
  {
    "id": "service-id",
    "name": "Замена масла",
    "description": "Полная замена моторного масла",
    "category": "MAINTENANCE",
    "price": 2500.00,
    "duration": 30,
    "isActive": true,
    "rating": 4.5,
    "reviewCount": 25
  }
]
```

#### POST `/services` [ADMIN]
Создать новую услугу

---

### 📅 Записи
#### GET `/appointments/my`
Получить записи пользователя

#### POST `/appointments`
Создать новую запись

**Запрос:**
```json
{
  "serviceId": "service-id",
  "masterId": "master-id",
  "appointmentDateTime": "2024-01-20T14:00:00",
  "notes": "Особые пожелания"
}
```

#### PUT `/appointments/{id}/status`
Изменить статус записи

**Запрос:**
```json
{
  "status": "CONFIRMED"
}
```

**Статусы записей:**
- `PENDING` - Ожидает подтверждения
- `CONFIRMED` - Подтверждена
- `IN_PROGRESS` - В процессе
- `COMPLETED` - Завершена
- `CANCELLED` - Отменена

---

### 🛒 Продукты и заказы
#### GET `/products`
Получить каталог продуктов

#### POST `/orders`
Создать новый заказ

**Запрос:**
```json
{
  "items": [
    {
      "productId": "product-id",
      "quantity": 2
    }
  ],
  "deliveryAddress": "Адрес доставки"
}
```

---

### ⭐ Отзывы
#### GET `/reviews`
Получить отзывы

#### POST `/reviews`
Создать отзыв

**Запрос:**
```json
{
  "serviceId": "service-id",
  "masterId": "master-id",
  "appointmentId": "appointment-id",
  "rating": 5,
  "comment": "Отличная работа!"
}
```

---

### 💬 Чат
#### POST `/chat/send`
Отправить сообщение

**Запрос:**
```json
{
  "recipientId": "user-id",
  "content": "Текст сообщения",
  "type": "TEXT",
  "appointmentId": "appointment-id"
}
```

#### GET `/chat/conversation/{userId}`
Получить переписку с пользователем

#### GET `/chat/unread/count`
Количество непрочитанных сообщений

---

### 🔔 Уведомления
#### GET `/notifications/my`
Получить мои уведомления

#### GET `/notifications/unread`
Непрочитанные уведомления

#### PUT `/notifications/{id}/read`
Отметить как прочитанное

---

### 📊 Аналитика [ADMIN]
#### GET `/analytics/dashboard`
Общая статистика дашборда

**Ответ 200:**
```json
{
  "totalClients": 150,
  "totalMasters": 8,
  "todayAppointments": 12,
  "monthRevenue": 450000.00,
  "monthGrowth": 15.5,
  "pendingOrders": 5,
  "lowStockItems": 3,
  "averageRating": 4.7,
  "topServices": [...],
  "topMasters": [...]
}
```

#### GET `/analytics/revenue`
Статистика доходов

#### GET `/analytics/masters/top`
Топ мастера по производительности

---

### 📈 Отчеты [ADMIN]
#### GET `/reports/appointments`
Отчет по записям за период

**Параметры:**
- `startDate` - Дата начала (ISO 8601)
- `endDate` - Дата окончания (ISO 8601)
- `status` (optional) - Статус записей

#### GET `/reports/orders`
Отчет по заказам

---

## 🚨 Коды ошибок

### HTTP Статусы
- `200` - Успешно
- `201` - Создано
- `400` - Неверный запрос
- `401` - Не авторизован
- `403` - Доступ запрещен
- `404` - Не найдено
- `409` - Конфликт
- `500` - Внутренняя ошибка сервера

### Формат ошибок
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Описание ошибки",
  "path": "/api/endpoint"
}
```

### Типичные ошибки
- `USER_NOT_FOUND` - Пользователь не найден
- `INVALID_CREDENTIALS` - Неверные учетные данные
- `ACCESS_DENIED` - Недостаточно прав
- `VALIDATION_ERROR` - Ошибка валидации
- `BUSINESS_RULE_VIOLATION` - Нарушение бизнес-правил

---

## 🔧 Конфигурация

### Переменные окружения
```bash
# База данных
MONGO_URI=mongodb://localhost:27017/supersto_db

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=86400

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000

# Профиль
SPRING_PROFILES_ACTIVE=dev
```

---

## 🧪 Тестирование

### Запуск тестов
```bash
./mvnw test
```

### Примеры запросов (cURL)

#### Регистрация
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Тест",
    "lastName": "Пользователь",
    "role": "CLIENT"
  }'
```

#### Получение услуг
```bash
curl -X GET http://localhost:8080/api/services \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📚 Дополнительная информация

### Swagger UI
Документация доступна по адресу: `http://localhost:8080/swagger-ui.html`

### Monitoring
- Health Check: `GET /actuator/health`
- Metrics: `GET /actuator/metrics`

### Версионирование
API использует семантическое версионирование. Текущая версия: `v1.0.0`

---

**Последнее обновление**: 2024-01-XX  
**Разработчик**: СуперСТО Team  
**Поддержка**: support@supersto.ru 