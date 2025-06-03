# 🚀 Быстрый запуск СуперСТО Backend

## 📋 Требования

- **Java 17+**
- **Maven 3.6+**
- **Docker** и **Docker Compose**

## 🛠 Запуск разработки

### 1. Запуск инфраструктуры

```bash
# Запуск MongoDB и Redis
docker-compose up -d

# Проверка статуса
docker-compose ps
```

### 2. Запуск приложения

```bash
# Установка зависимостей
./mvnw clean install

# Запуск в режиме разработки
./mvnw spring-boot:run
```

## 🌐 Доступные сервисы

| Сервис | URL | Описание |
|--------|-----|----------|
| **Backend API** | http://localhost:8080/api | REST API |
| **Swagger UI** | http://localhost:8080/api/swagger-ui.html | Документация API |
| **MongoDB** | mongodb://localhost:27017 | База данных |
| **Mongo Express** | http://localhost:8081 | Web UI для MongoDB |
| **Redis** | redis://localhost:6379 | Кэш и сессии |
| **Health Check** | http://localhost:8080/api/actuator/health | Мониторинг |

## 🔐 Тестовые данные

**Администратор:**
- Email: `admin@supersto.ru`
- Пароль: `password`

## 📦 Docker команды

```bash
# Остановка сервисов
docker-compose down

# Перезапуск с пересборкой
docker-compose down && docker-compose up -d

# Просмотр логов
docker-compose logs -f mongodb
docker-compose logs -f redis

# Очистка данных (ВНИМАНИЕ: удалит все данные!)
docker-compose down -v
```

## 🧪 Тестирование

```bash
# Запуск всех тестов
./mvnw test

# Запуск интеграционных тестов
./mvnw verify

# Генерация отчета о покрытии
./mvnw jacoco:report
```

## 🔧 Конфигурация

### Переменные окружения

```bash
# MongoDB
MONGODB_URI=mongodb://localhost:27017/supersto_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key

# Email
MAIL_HOST=smtp.gmail.com
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

### Профили Spring

- **dev** - разработка (по умолчанию)
- **test** - тестирование
- **prod** - продакшн

```bash
# Запуск с определенным профилем
./mvnw spring-boot:run -Dspring-boot.run.profiles=prod
```

## 📝 Структура проекта

```
backend/
├── src/main/java/ru/supersto/
│   ├── config/          # Конфигурации
│   ├── controller/      # REST контроллеры
│   ├── dto/            # Data Transfer Objects
│   ├── entity/         # MongoDB документы
│   ├── exception/      # Обработка исключений
│   ├── mapper/         # MapStruct мапперы
│   ├── repository/     # MongoDB репозитории
│   ├── security/       # Безопасность
│   ├── service/        # Бизнес-логика
│   └── util/           # Утилиты
├── src/main/resources/
│   ├── application.yml # Конфигурация
│   └── static/         # Статические файлы
└── src/test/          # Тесты
```

## 🐛 Отладка

### Логи приложения

```bash
# Просмотр логов в реальном времени
tail -f logs/supersto-backend.log

# Поиск ошибок
grep ERROR logs/supersto-backend.log
```

### MongoDB

```bash
# Подключение к MongoDB
docker exec -it supersto-mongodb mongosh

# Проверка коллекций
use supersto_db
show collections
db.users.find().limit(5)
```

### Redis

```bash
# Подключение к Redis
docker exec -it supersto-redis redis-cli

# Просмотр ключей
keys *
```

## 🚀 Сборка для продакшена

```bash
# Сборка JAR файла
./mvnw clean package

# Сборка Docker образа
docker build -t supersto-backend .

# Запуск контейнера
docker run -p 8080:8080 supersto-backend
```

## 📞 Помощь

При возникновении проблем:

1. Проверьте, что все сервисы запущены: `docker-compose ps`
2. Посмотрите логи: `docker-compose logs`
3. Убедитесь, что порты свободны: `netstat -an | grep :8080`
4. Проверьте health check: `curl http://localhost:8080/api/actuator/health`

---

✅ **Готово!** Backend должен быть доступен по адресу http://localhost:8080/api 