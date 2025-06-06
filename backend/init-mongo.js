/* eslint-disable */
// Скрипт инициализации MongoDB для проекта СуперСТО с большим количеством реалистичных данных

// Переключаемся на базу данных приложения
db = db.getSiblingDB('supersto_db');

// Создаем пользователя для приложения
try {
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
  print('✅ Пользователь создан');
} catch (e) {
  print('⚠️ Пользователь уже существует');
}

// Очищаем коллекции если они существуют
print('🧹 Очистка коллекций...');
db.users.deleteMany({});
db.services.deleteMany({});
db.service_stations.deleteMany({});
db.products.deleteMany({});
db.appointments.deleteMany({});
db.orders.deleteMany({});
db.reviews.deleteMany({});
db.chat_messages.deleteMany({});
db.notifications.deleteMany({});

// Создаем индексы
print('📝 Создание индексов...');

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

// Коллекция уведомлений
db.notifications.createIndex({ "userId": 1 });
db.notifications.createIndex({ "isRead": 1 });
db.notifications.createIndex({ "createdAt": -1 });

print('✅ Индексы созданы');

// Функция для генерации случайной даты в прошлом
function randomPastDate(daysAgo) {
  const now = new Date();
  const randomDays = Math.floor(Math.random() * daysAgo);
  return new Date(now.getTime() - (randomDays * 24 * 60 * 60 * 1000));
}

// Функция для генерации случайной даты в будущем
function randomFutureDate(daysAhead) {
  const now = new Date();
  const randomDays = Math.floor(Math.random() * daysAhead);
  return new Date(now.getTime() + (randomDays * 24 * 60 * 60 * 1000));
}

// Создаем много пользователей
print('👥 Создание пользователей...');

const adminId = ObjectId();
const masterIds = [];
const clientIds = [];

// Создаем администраторов
const admins = [
  {
    _id: adminId,
    email: "admin@supersto.ru",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.", // password
    firstName: "Админ",
    lastName: "Главный",
    phone: "+7 (999) 000-01-01",
    role: "ADMIN",
    loyaltyLevel: "PLATINUM",
    loyaltyPoints: 5000,
    isActive: true,
    createdAt: randomPastDate(365)
  },
  {
    _id: ObjectId(),
    email: "admin2@supersto.ru",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.",
    firstName: "Анна",
    lastName: "Администратор",
    phone: "+7 (999) 000-01-02",
    role: "ADMIN",
    loyaltyLevel: "PLATINUM",
    loyaltyPoints: 3500,
    isActive: true,
    createdAt: randomPastDate(200)
  }
];

// Создаем мастеров
const masterNames = [
  {firstName: "Иван", lastName: "Мастеров", email: "master1@supersto.ru"},
  {firstName: "Сергей", lastName: "Автосервисов", email: "master2@supersto.ru"},
  {firstName: "Дмитрий", lastName: "Ремонтников", email: "master3@supersto.ru"},
  {firstName: "Алексей", lastName: "Диагностов", email: "master4@supersto.ru"},
  {firstName: "Михаил", lastName: "Двигателев", email: "master5@supersto.ru"},
  {firstName: "Владимир", lastName: "Электриков", email: "master6@supersto.ru"},
  {firstName: "Андрей", lastName: "Кузовщиков", email: "master7@supersto.ru"},
  {firstName: "Павел", lastName: "Шиномонтажер", email: "master8@supersto.ru"}
];

const masters = masterNames.map((master, index) => {
  const masterId = ObjectId();
  masterIds.push(masterId);
  return {
    _id: masterId,
    email: master.email,
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.",
    firstName: master.firstName,
    lastName: master.lastName,
    phone: `+7 (999) 000-02-${String(index + 10).padStart(2, '0')}`,
    role: "MASTER",
    loyaltyLevel: index < 3 ? "GOLD" : "SILVER",
    loyaltyPoints: Math.floor(Math.random() * 2000) + 500,
    isActive: true,
    createdAt: randomPastDate(300)
  };
});

// Создаем много клиентов
const clientNames = [
  {firstName: "Петр", lastName: "Иванов", email: "client1@supersto.ru"},
  {firstName: "Александр", lastName: "Петров", email: "client2@supersto.ru"},
  {firstName: "Николай", lastName: "Сидоров", email: "client3@supersto.ru"},
  {firstName: "Василий", lastName: "Кузнецов", email: "client4@supersto.ru"},
  {firstName: "Андрей", lastName: "Смирнов", email: "client5@supersto.ru"},
  {firstName: "Сергей", lastName: "Попов", email: "client6@supersto.ru"},
  {firstName: "Дмитрий", lastName: "Лебедев", email: "client7@supersto.ru"},
  {firstName: "Алексей", lastName: "Козлов", email: "client8@supersto.ru"},
  {firstName: "Игорь", lastName: "Новиков", email: "client9@supersto.ru"},
  {firstName: "Владимир", lastName: "Морозов", email: "client10@supersto.ru"},
  {firstName: "Евгений", lastName: "Волков", email: "client11@supersto.ru"},
  {firstName: "Олег", lastName: "Соловьев", email: "client12@supersto.ru"},
  {firstName: "Максим", lastName: "Васильев", email: "client13@supersto.ru"},
  {firstName: "Роман", lastName: "Захаров", email: "client14@supersto.ru"},
  {firstName: "Денис", lastName: "Борисов", email: "client15@supersto.ru"},
  {firstName: "Константин", lastName: "Федоров", email: "client16@supersto.ru"},
  {firstName: "Станислав", lastName: "Михайлов", email: "client17@supersto.ru"},
  {firstName: "Артем", lastName: "Тарасов", email: "client18@supersto.ru"},
  {firstName: "Виктор", lastName: "Белов", email: "client19@supersto.ru"},
  {firstName: "Анатолий", lastName: "Комаров", email: "client20@supersto.ru"},
  {firstName: "Илья", lastName: "Орлов", email: "client21@supersto.ru"},
  {firstName: "Юрий", lastName: "Киселев", email: "client22@supersto.ru"},
  {firstName: "Григорий", lastName: "Макаров", email: "client23@supersto.ru"},
  {firstName: "Михаил", lastName: "Андреев", email: "client24@supersto.ru"},
  {firstName: "Redaer05", lastName: "Проверочный", email: "Redaer05@yandex.ru"}
];

const clients = clientNames.map((client, index) => {
  const clientId = ObjectId();
  clientIds.push(clientId);
  const loyaltyLevels = ["BRONZE", "SILVER", "GOLD"];
  return {
    _id: clientId,
    email: client.email,
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.",
    firstName: client.firstName,
    lastName: client.lastName,
    phone: `+7 (999) 000-03-${String(index + 10).padStart(2, '0')}`,
    role: "CLIENT",
    loyaltyLevel: loyaltyLevels[index % 3],
    loyaltyPoints: Math.floor(Math.random() * 1000),
    isActive: index < 23, // последние 2 неактивны
    createdAt: randomPastDate(400)
  };
});

const allUsers = [...admins, ...masters, ...clients];
db.users.insertMany(allUsers);
print('✅ Создано ' + allUsers.length + ' пользователей');

// Создаем СТО
print('🏢 Создание СТО...');

const serviceStations = [
  {
    _id: ObjectId(),
    name: "СуперСТО Центр",
    address: "г. Москва, ул. Центральная, д. 1",
    phone: "+7 (495) 000-01-01",
    email: "center@supersto.ru",
    description: "Основной центр обслуживания автомобилей с полным спектром услуг",
    workingHours: {
      start: "08:00",
      end: "20:00"
    },
    createdAt: randomPastDate(365),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    name: "СуперСТО Север",
    address: "г. Москва, ул. Северная, д. 15",
    phone: "+7 (495) 000-02-02",
    email: "north@supersto.ru",
    description: "Северный филиал сети СуперСТО, специализация - кузовной ремонт",
    workingHours: {
      start: "09:00",
      end: "21:00"
    },
    createdAt: randomPastDate(300),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    name: "СуперСТО Восток",
    address: "г. Москва, ул. Восточная, д. 25",
    phone: "+7 (495) 000-03-03",
    email: "east@supersto.ru",
    description: "Восточный филиал, экспресс-сервис и шиномонтаж",
    workingHours: {
      start: "07:00",
      end: "22:00"
    },
    createdAt: randomPastDate(200),
    updatedAt: new Date()
  }
];

db.service_stations.insertMany(serviceStations);
print('✅ Создано ' + serviceStations.length + ' СТО');

// Создаем услуги
print('🔧 Создание услуг...');

const servicesData = [
  // Диагностика
  {
    _id: ObjectId(),
    name: "Компьютерная диагностика двигателя",
    description: "Полная диагностика электронных систем двигателя с распечаткой кодов ошибок",
    category: "Диагностика",
    price: NumberDecimal("1500.0"),
    duration: 45,
    isActive: true,
    createdAt: randomPastDate(365)
  },
  {
    _id: ObjectId(),
    name: "Диагностика ходовой части",
    description: "Проверка состояния подвески, амортизаторов, рулевого управления",
    category: "Диагностика",
    price: NumberDecimal("1200.0"),
    duration: 60,
    isActive: true,
    createdAt: randomPastDate(365)
  },
  {
    _id: ObjectId(),
    name: "Диагностика тормозной системы",
    description: "Проверка тормозных дисков, колодок, жидкости и магистралей",
    category: "Диагностика",
    price: NumberDecimal("800.0"),
    duration: 30,
    isActive: true,
    createdAt: randomPastDate(365)
  },

  // Ремонт двигателя
  {
    _id: ObjectId(),
    name: "Замена масла и фильтров",
    description: "Замена моторного масла, масляного и воздушного фильтров",
    category: "Ремонт двигателя",
    price: NumberDecimal("2500.0"),
    duration: 60,
    isActive: true,
    createdAt: randomPastDate(365)
  },
  {
    _id: ObjectId(),
    name: "Замена ремня ГРМ",
    description: "Замена ремня газораспределительного механизма с роликами",
    category: "Ремонт двигателя",
    price: NumberDecimal("8500.0"),
    duration: 240,
    isActive: true,
    createdAt: randomPastDate(365)
  },
  {
    _id: ObjectId(),
    name: "Ремонт системы охлаждения",
    description: "Замена радиатора, термостата, патрубков системы охлаждения",
    category: "Ремонт двигателя",
    price: NumberDecimal("6500.0"),
    duration: 180,
    isActive: true,
    createdAt: randomPastDate(365)
  },
  {
    _id: ObjectId(),
    name: "Капитальный ремонт двигателя",
    description: "Полная разборка и сборка двигателя с заменой поршневой группы",
    category: "Ремонт двигателя",
    price: NumberDecimal("85000.0"),
    duration: 1440,
    isActive: true,
    createdAt: randomPastDate(365)
  },

  // Электрика
  {
    _id: ObjectId(),
    name: "Замена аккумулятора",
    description: "Замена аккумуляторной батареи с проверкой генератора",
    category: "Электрика",
    price: NumberDecimal("3500.0"),
    duration: 30,
    isActive: true,
    createdAt: randomPastDate(365)
  },
  {
    _id: ObjectId(),
    name: "Ремонт генератора",
    description: "Диагностика и ремонт генератора переменного тока",
    category: "Электрика",
    price: NumberDecimal("4500.0"),
    duration: 120,
    isActive: true,
    createdAt: randomPastDate(365)
  },
  {
    _id: ObjectId(),
    name: "Замена стартера",
    description: "Снятие, диагностика и установка стартера",
    category: "Электрика",
    price: NumberDecimal("5500.0"),
    duration: 90,
    isActive: true,
    createdAt: randomPastDate(365)
  },

  // Кузовной ремонт
  {
    _id: ObjectId(),
    name: "Покраска элемента кузова",
    description: "Покраска одного элемента кузова (дверь, крыло, бампер)",
    category: "Кузовной ремонт",
    price: NumberDecimal("12000.0"),
    duration: 480,
    isActive: true,
    createdAt: randomPastDate(365)
  },
  {
    _id: ObjectId(),
    name: "Рихтовка после ДТП",
    description: "Восстановление геометрии кузова после аварии",
    category: "Кузовной ремонт",
    price: NumberDecimal("25000.0"),
    duration: 720,
    isActive: true,
    createdAt: randomPastDate(365)
  },
  {
    _id: ObjectId(),
    name: "Полировка кузова",
    description: "Абразивная полировка с защитным покрытием",
    category: "Кузовной ремонт",
    price: NumberDecimal("8500.0"),
    duration: 240,
    isActive: true,
    createdAt: randomPastDate(365)
  },

  // Шиномонтаж
  {
    _id: ObjectId(),
    name: "Замена колес",
    description: "Снятие и установка 4-х колес с балансировкой",
    category: "Шиномонтаж",
    price: NumberDecimal("1600.0"),
    duration: 45,
    isActive: true,
    createdAt: randomPastDate(365)
  },
  {
    _id: ObjectId(),
    name: "Ремонт проколов",
    description: "Ремонт проколов в шине методом жгутования",
    category: "Шиномонтаж",
    price: NumberDecimal("800.0"),
    duration: 20,
    isActive: true,
    createdAt: randomPastDate(365)
  },
  {
    _id: ObjectId(),
    name: "Балансировка колес",
    description: "Балансировка 4-х колес на станке",
    category: "Шиномонтаж",
    price: NumberDecimal("1200.0"),
    duration: 30,
    isActive: true,
    createdAt: randomPastDate(365)
  },

  // ТО
  {
    _id: ObjectId(),
    name: "ТО-1 (15000 км)",
    description: "Плановое техническое обслуживание - замена масла, фильтров, проверка систем",
    category: "ТО",
    price: NumberDecimal("5500.0"),
    duration: 120,
    isActive: true,
    createdAt: randomPastDate(365)
  },
  {
    _id: ObjectId(),
    name: "ТО-2 (30000 км)",
    description: "Расширенное ТО с заменой свечей, проверкой тормозов",
    category: "ТО",
    price: NumberDecimal("8500.0"),
    duration: 180,
    isActive: true,
    createdAt: randomPastDate(365)
  },
  {
    _id: ObjectId(),
    name: "ТО-3 (60000 км)",
    description: "Полное ТО с заменой ремней, жидкостей, диагностикой",
    category: "ТО",
    price: NumberDecimal("12500.0"),
    duration: 240,
    isActive: true,
    createdAt: randomPastDate(365)
  }
];

const serviceIds = servicesData.map(service => service._id);
db.services.insertMany(servicesData);
print('✅ Создано ' + servicesData.length + ' услуг');

// Создаем продукты
print('🛒 Создание продуктов...');

const productsData = [
  // Масла моторные
  {
    _id: ObjectId(),
    name: "Castrol GTX 5W-30",
    description: "Высококачественное моторное масло для бензиновых двигателей",
    category: "Масла и жидкости",
    brand: "Castrol",
    partNumber: "CAST-GTX-5W30-4L",
    price: NumberDecimal("2800.0"),
    stockQuantity: 25,
    imageUrl: "https://example.com/castrol-gtx.jpg",
    rating: 4.5,
    reviewCount: 156,
    createdAt: randomPastDate(200)
  },
  {
    _id: ObjectId(),
    name: "Mobil 1 0W-20",
    description: "Синтетическое моторное масло премиум класса",
    category: "Масла и жидкости",
    brand: "Mobil",
    partNumber: "MOBIL-1-0W20-4L",
    price: NumberDecimal("4500.0"),
    stockQuantity: 18,
    imageUrl: "https://example.com/mobil1.jpg",
    rating: 4.8,
    reviewCount: 203,
    createdAt: randomPastDate(180)
  },
  {
    _id: ObjectId(),
    name: "Shell Helix Ultra 5W-40",
    description: "Полностью синтетическое моторное масло",
    category: "Масла и жидкости",
    brand: "Shell",
    partNumber: "SHELL-HU-5W40-4L",
    price: NumberDecimal("3800.0"),
    stockQuantity: 32,
    imageUrl: "https://example.com/shell-helix.jpg",
    rating: 4.6,
    reviewCount: 189,
    createdAt: randomPastDate(220)
  },

  // Фильтры
  {
    _id: ObjectId(),
    name: "Фильтр масляный Mann W 712/75",
    description: "Оригинальный масляный фильтр для BMW, Mercedes",
    category: "Фильтры",
    brand: "Mann",
    partNumber: "MANN-W712-75",
    price: NumberDecimal("850.0"),
    stockQuantity: 45,
    imageUrl: "https://example.com/mann-filter.jpg",
    rating: 4.7,
    reviewCount: 234,
    createdAt: randomPastDate(150)
  },
  {
    _id: ObjectId(),
    name: "Фильтр воздушный Bosch 1987429404",
    description: "Воздушный фильтр для Volkswagen, Audi",
    category: "Фильтры",
    brand: "Bosch",
    partNumber: "BOSCH-1987429404",
    price: NumberDecimal("1200.0"),
    stockQuantity: 28,
    imageUrl: "https://example.com/bosch-air-filter.jpg",
    rating: 4.4,
    reviewCount: 167,
    createdAt: randomPastDate(160)
  },
  {
    _id: ObjectId(),
    name: "Фильтр топливный Mahle KL 756",
    description: "Топливный фильтр для дизельных двигателей",
    category: "Фильтры",
    brand: "Mahle",
    partNumber: "MAHLE-KL756",
    price: NumberDecimal("1650.0"),
    stockQuantity: 22,
    imageUrl: "https://example.com/mahle-fuel-filter.jpg",
    rating: 4.5,
    reviewCount: 145,
    createdAt: randomPastDate(170)
  },

  // Тормозные колодки
  {
    _id: ObjectId(),
    name: "Колодки тормозные Brembo P 85 020",
    description: "Передние тормозные колодки для BMW 3 серии",
    category: "Тормозная система",
    brand: "Brembo",
    partNumber: "BREMBO-P85020",
    price: NumberDecimal("4500.0"),
    stockQuantity: 15,
    imageUrl: "https://example.com/brembo-pads.jpg",
    rating: 4.9,
    reviewCount: 298,
    createdAt: randomPastDate(140)
  },
  {
    _id: ObjectId(),
    name: "Колодки тормозные ATE 13.0460-7215.2",
    description: "Задние тормозные колодки для Mercedes C-класс",
    category: "Тормозная система",
    brand: "ATE",
    partNumber: "ATE-13046072152",
    price: NumberDecimal("3200.0"),
    stockQuantity: 19,
    imageUrl: "https://example.com/ate-pads.jpg",
    rating: 4.6,
    reviewCount: 187,
    createdAt: randomPastDate(155)
  },

  // Аккумуляторы
  {
    _id: ObjectId(),
    name: "Аккумулятор Bosch S4 005 60Ah",
    description: "Стартерный аккумулятор 60А/ч для легковых автомобилей",
    category: "Электрика",
    brand: "Bosch",
    partNumber: "BOSCH-S4005-60AH",
    price: NumberDecimal("8500.0"),
    stockQuantity: 12,
    imageUrl: "https://example.com/bosch-battery.jpg",
    rating: 4.7,
    reviewCount: 156,
    createdAt: randomPastDate(190)
  },
  {
    _id: ObjectId(),
    name: "Аккумулятор Varta Blue Dynamic E11 74Ah",
    description: "Аккумулятор повышенной емкости для современных авто",
    category: "Электрика",
    brand: "Varta",
    partNumber: "VARTA-E11-74AH",
    price: NumberDecimal("10200.0"),
    stockQuantity: 8,
    imageUrl: "https://example.com/varta-battery.jpg",
    rating: 4.8,
    reviewCount: 201,
    createdAt: randomPastDate(175)
  },

  // Шины
  {
    _id: ObjectId(),
    name: "Michelin Pilot Sport 4 225/45 R17",
    description: "Летние шины премиум класса для спортивного вождения",
    category: "Шины и диски",
    brand: "Michelin",
    partNumber: "MICH-PS4-225-45-R17",
    price: NumberDecimal("12500.0"),
    stockQuantity: 20,
    imageUrl: "https://example.com/michelin-ps4.jpg",
    rating: 4.9,
    reviewCount: 345,
    createdAt: randomPastDate(200)
  },
  {
    _id: ObjectId(),
    name: "Continental WinterContact TS 860 205/55 R16",
    description: "Зимние шины с отличным сцеплением на снегу и льду",
    category: "Шины и диски",
    brand: "Continental",
    partNumber: "CONT-WC860-205-55-R16",
    price: NumberDecimal("8900.0"),
    stockQuantity: 24,
    imageUrl: "https://example.com/continental-winter.jpg",
    rating: 4.7,
    reviewCount: 278,
    createdAt: randomPastDate(180)
  },

  // Свечи зажигания
  {
    _id: ObjectId(),
    name: "Свечи NGK Iridium IX BKR6EIX",
    description: "Иридиевые свечи зажигания увеличенного ресурса",
    category: "Система зажигания",
    brand: "NGK",
    partNumber: "NGK-BKR6EIX",
    price: NumberDecimal("1800.0"),
    stockQuantity: 40,
    imageUrl: "https://example.com/ngk-iridium.jpg",
    rating: 4.8,
    reviewCount: 267,
    createdAt: randomPastDate(160)
  },
  {
    _id: ObjectId(),
    name: "Свечи Bosch Platinum Plus FR7DPP332",
    description: "Платиновые свечи для бензиновых двигателей",
    category: "Система зажигания",
    brand: "Bosch",
    partNumber: "BOSCH-FR7DPP332",
    price: NumberDecimal("1200.0"),
    stockQuantity: 35,
    imageUrl: "https://example.com/bosch-platinum.jpg",
    rating: 4.5,
    reviewCount: 198,
    createdAt: randomPastDate(170)
  },

  // Дополнительные товары
  {
    _id: ObjectId(),
    name: "Незамерзающая жидкость -30°C",
    description: "Стеклоомывающая жидкость для зимнего периода",
    category: "Масла и жидкости",
    brand: "Arctic",
    partNumber: "ARCTIC-WASH-30-4L",
    price: NumberDecimal("350.0"),
    stockQuantity: 150,
    imageUrl: "https://example.com/antifreeze.jpg",
    rating: 4.2,
    reviewCount: 89,
    createdAt: randomPastDate(120)
  }
];

const productIds = productsData.map(product => product._id);
db.products.insertMany(productsData);
print('✅ Создано ' + productsData.length + ' продуктов');

// Создаем записи на услуги
print('📅 Создание записей на услуги...');

const appointmentStatuses = ["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];
const appointments = [];

for (let i = 0; i < 150; i++) {
  const appointment = {
    _id: ObjectId(),
    clientId: clientIds[Math.floor(Math.random() * clientIds.length)],
    masterId: masterIds[Math.floor(Math.random() * masterIds.length)],
    serviceId: serviceIds[Math.floor(Math.random() * serviceIds.length)],
    appointmentDate: i < 50 ? randomPastDate(30) : randomFutureDate(60),
    status: i < 30 ? "COMPLETED" : appointmentStatuses[Math.floor(Math.random() * appointmentStatuses.length)],
    notes: i % 5 === 0 ? "Клиент просил особое внимание к диагностике" : "",
    totalCost: NumberDecimal((Math.random() * 20000 + 1000).toFixed(2)),
    createdAt: randomPastDate(60),
    updatedAt: new Date()
  };
  appointments.push(appointment);
}

db.appointments.insertMany(appointments);
print('✅ Создано ' + appointments.length + ' записей на услуги');

// Создаем заказы продуктов
print('🛍️ Создание заказов продуктов...');

const orderStatuses = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];
const orders = [];

for (let i = 0; i < 80; i++) {
  const numItems = Math.floor(Math.random() * 5) + 1;
  const items = [];
  let totalAmount = 0;

  for (let j = 0; j < numItems; j++) {
    const randomProduct = productsData[Math.floor(Math.random() * productsData.length)];
    const quantity = Math.floor(Math.random() * 3) + 1;
    const itemPrice = parseFloat(randomProduct.price);
    
    items.push({
      productId: randomProduct._id,
      quantity: quantity,
      price: NumberDecimal(itemPrice.toFixed(2))
    });
    
    totalAmount += itemPrice * quantity;
  }

  const order = {
    _id: ObjectId(),
    clientId: clientIds[Math.floor(Math.random() * clientIds.length)],
    items: items,
    status: i < 20 ? "DELIVERED" : orderStatuses[Math.floor(Math.random() * orderStatuses.length)],
    totalAmount: NumberDecimal(totalAmount.toFixed(2)),
    deliveryAddress: `г. Москва, ул. ${["Ленина", "Пушкина", "Тверская", "Арбат", "Садовая"][Math.floor(Math.random() * 5)]}, д. ${Math.floor(Math.random() * 100) + 1}`,
    createdAt: randomPastDate(90),
    updatedAt: randomPastDate(30)
  };
  orders.push(order);
}

db.orders.insertMany(orders);
print('✅ Создано ' + orders.length + ' заказов');

// Создаем отзывы
print('⭐ Создание отзывов...');

const reviewTexts = [
  "Отличное обслуживание! Все сделали быстро и качественно.",
  "Мастера знают свое дело. Рекомендую!",
  "Цены адекватные, работа выполнена на совесть.",
  "Немного затянули по времени, но результат хороший.",
  "Все понравилось, буду обращаться еще.",
  "Профессиональный подход к работе.",
  "Вежливый персонал, удобная запись онлайн.",
  "Качественные запчасти, гарантия на работы.",
  "Быстро устранили проблему, машина как новая!",
  "Хорошее СТО, советую друзьям."
];

const reviews = [];
const completedAppointments = appointments.filter(apt => apt.status === "COMPLETED");

for (let i = 0; i < Math.min(completedAppointments.length, 60); i++) {
  const appointment = completedAppointments[i];
  const review = {
    _id: ObjectId(),
    clientId: appointment.clientId,
    appointmentId: appointment._id,
    rating: Math.floor(Math.random() * 2) + 4, // 4-5 звезд
    comment: reviewTexts[Math.floor(Math.random() * reviewTexts.length)],
    createdAt: new Date(appointment.appointmentDate.getTime() + (Math.random() * 7 * 24 * 60 * 60 * 1000))
  };
  reviews.push(review);
}

db.reviews.insertMany(reviews);
print('✅ Создано ' + reviews.length + ' отзывов');

// Создаем сообщения чата
print('💬 Создание сообщений чата...');

const chatMessages = [];
const messageTexts = [
  "Здравствуйте! Запись подтверждена на завтра в 10:00",
  "Спасибо за обращение! Мастер уже готовит рабочее место",
  "Добрый день! Можете подъехать, мы готовы принять ваш автомобиль",
  "Диагностика завершена. Обнаружена неисправность генератора",
  "Запчасть заказана, ожидаем поставку в течение 2 дней",
  "Работы выполнены. Можете забирать автомобиль",
  "Спасибо за отзыв! Рады были помочь",
  "Не забудьте про следующее ТО через 15000 км",
  "У нас действует скидка 10% на масла до конца месяца"
];

for (let i = 0; i < 200; i++) {
  const isFromClient = Math.random() > 0.6;
  const clientId = clientIds[Math.floor(Math.random() * clientIds.length)];
  const masterId = masterIds[Math.floor(Math.random() * masterIds.length)];
  
  const message = {
    _id: ObjectId(),
    senderId: isFromClient ? clientId : masterId,
    receiverId: isFromClient ? masterId : clientId,
    content: messageTexts[Math.floor(Math.random() * messageTexts.length)],
    sentAt: randomPastDate(60),
    isRead: Math.random() > 0.3
  };
  chatMessages.push(message);
}

db.chat_messages.insertMany(chatMessages);
print('✅ Создано ' + chatMessages.length + ' сообщений чата');

// Создаем уведомления
print('🔔 Создание уведомлений...');

const notificationTexts = [
  "Ваша запись подтверждена",
  "Напоминание о записи завтра",
  "Работы по вашему автомобилю завершены",
  "Ваш заказ отправлен",
  "Получен новый отзыв",
  "Акция: скидка 15% на все масла",
  "Не забудьте про плановое ТО",
  "Новое сообщение от мастера",
  "Ваш заказ доставлен"
];

const notifications = [];

for (let i = 0; i < 300; i++) {
  const notification = {
    _id: ObjectId(),
    userId: [...clientIds, ...masterIds][Math.floor(Math.random() * (clientIds.length + masterIds.length))],
    title: "Уведомление",
    message: notificationTexts[Math.floor(Math.random() * notificationTexts.length)],
    type: ["INFO", "WARNING", "SUCCESS"][Math.floor(Math.random() * 3)],
    isRead: Math.random() > 0.4,
    createdAt: randomPastDate(30)
  };
  notifications.push(notification);
}

db.notifications.insertMany(notifications);
print('✅ Создано ' + notifications.length + ' уведомлений');

print('🎉 Инициализация базы данных завершена!');
print('📊 Создано данных:');
print('   👥 Пользователи: ' + allUsers.length);
print('   🏢 СТО: ' + serviceStations.length);
print('   🔧 Услуги: ' + servicesData.length);
print('   🛒 Продукты: ' + productsData.length);
print('   📅 Записи: ' + appointments.length);
print('   🛍️ Заказы: ' + orders.length);
print('   ⭐ Отзывы: ' + reviews.length);
print('   💬 Сообщения: ' + chatMessages.length);
print('   🔔 Уведомления: ' + notifications.length); 