# СуперСТО - Платформа автосервиса

Веб-платформа для управления автосервисом с мультиролевой системой.

## Функционал

### Роли пользователей
- **Клиенты** - запись на обслуживание, покупка запчастей, программа лояльности
- **Мастера** - управление заявками, статистика работы  
- **Администраторы** - управление системой, аналитика

### Основные возможности
- Система записи на обслуживание
- Каталог запчастей с корзиной
- Чат между клиентами и мастерами
- Программа лояльности
- Система отзывов и рейтингов
- Аналитическая панель
- Управление инвентарем
- Финансовый учет

## Технологии

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Redux Toolkit
- React Router

### Backend
- Spring Boot
- MongoDB
- JWT Authentication
- WebSocket (для чата)

## Установка и запуск

### Требования
- Node.js 16+
- Java 17+
- MongoDB

### Frontend
```bash
git clone https://github.com/saqreed/super-sto.git
cd super-sto
npm install
npm start
```

### Backend
```bash
cd backend
./mvnw spring-boot:run
```

## Команды

```bash
npm start          # Запуск в режиме разработки
npm run build      # Сборка для продакшена
npm test          # Запуск тестов
```

## Структура проекта

```
src/
├── components/    # Компоненты
├── pages/        # Страницы
├── store/        # Redux store
├── api/          # API клиенты
├── types/        # TypeScript типы
└── utils/        # Утилиты

backend/
├── src/main/java/ru/supersto/
│   ├── controller/    # REST контроллеры
│   ├── service/      # Бизнес логика
│   ├── repository/   # Репозитории
│   ├── model/        # Модели данных
│   └── config/       # Конфигурация
```

## Лицензия

MIT License
