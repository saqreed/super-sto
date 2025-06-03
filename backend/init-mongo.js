// Скрипт инициализации MongoDB для проекта СуперСТО

// Переключаемся на базу данных приложения
db = db.getSiblingDB('supersto_db');

// Создаем пользователя для приложения
db.createUser({
  user: 'supersto_user',
  pwd: 'supersto_pass',
  roles: [
    {
      role: 'readWrite',
      db: 'supersto_db'
    }
  ]
});

// Создаем коллекции и индексы
print('Создание коллекций и индексов...');

// Коллекция пользователей
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "role": 1 });
db.users.createIndex({ "createdAt": 1 });

// Коллекция услуг
db.services.createIndex({ "category": 1 });
db.services.createIndex({ "isActive": 1 });
db.services.createIndex({ "name": "text", "description": "text" });

// Коллекция записей
db.appointments.createIndex({ "appointmentDate": 1 });
db.appointments.createIndex({ "clientId": 1 });
db.appointments.createIndex({ "masterId": 1 });
db.appointments.createIndex({ "status": 1 });

// Коллекция продуктов
db.products.createIndex({ "partNumber": 1 }, { unique: true });
db.products.createIndex({ "category": 1 });
db.products.createIndex({ "brand": 1 });
db.products.createIndex({ "name": "text", "description": "text" });

// Коллекция заказов
db.orders.createIndex({ "clientId": 1 });
db.orders.createIndex({ "status": 1 });
db.orders.createIndex({ "createdAt": -1 });

// Коллекция отзывов
db.reviews.createIndex({ "clientId": 1 });
db.reviews.createIndex({ "appointmentId": 1 });
db.reviews.createIndex({ "createdAt": -1 });

// Коллекция сообщений чата
db.chat_messages.createIndex({ "senderId": 1, "receiverId": 1 });
db.chat_messages.createIndex({ "appointmentId": 1 });
db.chat_messages.createIndex({ "sentAt": -1 });

print('Инициализация базы данных завершена успешно!');

// Создаем тестового администратора
db.users.insertOne({
  _id: ObjectId(),
  email: "admin@supersto.ru",
  password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.", // пароль: password
  firstName: "Администратор",
  lastName: "Системы",
  phone: "+7 (999) 123-45-67",
  role: "ADMIN",
  createdAt: new Date(),
  isActive: true,
  loyaltyLevel: "GOLD",
  loyaltyPoints: 1000
});

print('Тестовый администратор создан: admin@supersto.ru / password'); 