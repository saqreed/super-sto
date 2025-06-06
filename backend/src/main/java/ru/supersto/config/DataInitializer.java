package ru.supersto.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import ru.supersto.entity.*;
import ru.supersto.repository.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

        private final UserRepository userRepository;
        private final ServiceRepository serviceRepository;
        private final ServiceStationRepository serviceStationRepository;
        private final ProductRepository productRepository;
        private final AppointmentRepository appointmentRepository;
        private final OrderRepository orderRepository;
        private final ReviewRepository reviewRepository;
        private final ChatMessageRepository chatMessageRepository;
        private final NotificationRepository notificationRepository;
        private final PasswordEncoder passwordEncoder;

        private final Random random = new Random();

        @Override
        public void run(String... args) throws Exception {
                // Этот метод выполняется раньше и может не подключиться к MongoDB
                log.info("🚀 DataInitializer CommandLineRunner запущен, ждем ApplicationReadyEvent...");
        }

        @EventListener(ApplicationReadyEvent.class)
        public void initializeData() {
                log.info("🚀 Принудительная инициализация больших данных после полного старта приложения...");

                try {
                        // Принудительно очищаем и заполняем данные при каждом старте
                        clearAllData();
                        createUsers();
                        createServiceStations();
                        createServices();
                        createProducts();
                        createAppointments();
                        createOrders();
                        createReviews();
                        createChatMessages();
                        createNotifications();

                        log.info("✅ Принудительная инициализация данных завершена!");
                        printStatistics();
                } catch (Exception e) {
                        log.error("❌ Ошибка при инициализации данных: {}", e.getMessage(), e);
                }
        }

        private void clearAllData() {
                log.info("🧹 Очистка существующих данных...");
                notificationRepository.deleteAll();
                chatMessageRepository.deleteAll();
                reviewRepository.deleteAll();
                orderRepository.deleteAll();
                appointmentRepository.deleteAll();
                productRepository.deleteAll();
                serviceRepository.deleteAll();
                serviceStationRepository.deleteAll();
                userRepository.deleteAll();
                log.info("✅ Данные очищены");
        }

        private void createUsers() {
                log.info("👥 Создание большого количества пользователей...");

                List<User> users = new ArrayList<>();

                // Администраторы
                users.add(createUser("admin@supersto.ru", "admin123", "Админ", "Главный",
                                "+7 (999) 000-01-01", UserRole.ADMIN, LoyaltyLevel.PLATINUM, 5000));
                users.add(createUser("admin2@supersto.ru", "admin123", "Анна", "Администратор",
                                "+7 (999) 000-01-02", UserRole.ADMIN, LoyaltyLevel.PLATINUM, 3500));

                // Мастера
                String[][] masterData = {
                                { "master1@supersto.ru", "Иван", "Мастеров" },
                                { "master2@supersto.ru", "Сергей", "Автосервисов" },
                                { "master3@supersto.ru", "Дмитрий", "Ремонтников" },
                                { "master4@supersto.ru", "Алексей", "Диагностов" },
                                { "master5@supersto.ru", "Михаил", "Двигателев" },
                                { "master6@supersto.ru", "Владимир", "Электриков" },
                                { "master7@supersto.ru", "Андрей", "Кузовщиков" },
                                { "master8@supersto.ru", "Павел", "Шиномонтажер" }
                };

                for (int i = 0; i < masterData.length; i++) {
                        users.add(createUser(masterData[i][0], "master123", masterData[i][1], masterData[i][2],
                                        String.format("+7 (999) 000-02-%02d", i + 10), UserRole.MASTER,
                                        i < 3 ? LoyaltyLevel.GOLD : LoyaltyLevel.SILVER, 500 + random.nextInt(2000)));
                }

                // Клиенты
                String[][] clientData = {
                                { "client1@supersto.ru", "Петр", "Иванов" },
                                { "client2@supersto.ru", "Александр", "Петров" },
                                { "client3@supersto.ru", "Николай", "Сидоров" },
                                { "client4@supersto.ru", "Василий", "Кузнецов" },
                                { "client5@supersto.ru", "Андрей", "Смирнов" },
                                { "client6@supersto.ru", "Сергей", "Попов" },
                                { "client7@supersto.ru", "Дмитрий", "Лебедев" },
                                { "client8@supersto.ru", "Алексей", "Козлов" },
                                { "client9@supersto.ru", "Игорь", "Новиков" },
                                { "client10@supersto.ru", "Владимир", "Морозов" },
                                { "client11@supersto.ru", "Евгений", "Волков" },
                                { "client12@supersto.ru", "Олег", "Соловьев" },
                                { "client13@supersto.ru", "Максим", "Васильев" },
                                { "client14@supersto.ru", "Роман", "Захаров" },
                                { "client15@supersto.ru", "Денис", "Борисов" },
                                { "client16@supersto.ru", "Константин", "Федоров" },
                                { "client17@supersto.ru", "Станислав", "Михайлов" },
                                { "client18@supersto.ru", "Артем", "Тарасов" },
                                { "client19@supersto.ru", "Виктор", "Белов" },
                                { "client20@supersto.ru", "Анатолий", "Комаров" },
                                { "client21@supersto.ru", "Илья", "Орлов" },
                                { "client22@supersto.ru", "Юрий", "Киселев" },
                                { "client23@supersto.ru", "Григорий", "Макаров" },
                                { "client24@supersto.ru", "Михаил", "Андреев" },
                                { "Redaer05@yandex.ru", "Redaer05", "Проверочный" }
                };

                LoyaltyLevel[] loyaltyLevels = { LoyaltyLevel.BRONZE, LoyaltyLevel.SILVER, LoyaltyLevel.GOLD };

                for (int i = 0; i < clientData.length; i++) {
                        users.add(createUser(clientData[i][0], "client123", clientData[i][1], clientData[i][2],
                                        String.format("+7 (999) 000-03-%02d", i + 10), UserRole.CLIENT,
                                        loyaltyLevels[i % 3], random.nextInt(1000)));
                }

                userRepository.saveAll(users);
                log.info("✅ Создано {} пользователей", userRepository.count());
        }

        private User createUser(String email, String password, String firstName, String lastName,
                        String phone, UserRole role, LoyaltyLevel loyaltyLevel, int loyaltyPoints) {
                User user = new User();
                user.setEmail(email);
                user.setPassword(passwordEncoder.encode(password));
                user.setFirstName(firstName);
                user.setLastName(lastName);
                user.setPhone(phone);
                user.setRole(role);
                user.setLoyaltyLevel(loyaltyLevel);
                user.setLoyaltyPoints(loyaltyPoints);
                user.setCreatedAt(randomPastDate(400));
                return user;
        }

        private void createServiceStations() {
                log.info("🏢 Создание СТО...");

                List<ServiceStation> stations = Arrays.asList(
                                createServiceStation("СуперСТО Центр", "г. Москва, ул. Центральная, д. 1",
                                                "+7 (495) 000-01-01", "center@supersto.ru",
                                                "Основной центр обслуживания автомобилей с полным спектром услуг",
                                                "08:00", "20:00"),
                                createServiceStation("СуперСТО Север", "г. Москва, ул. Северная, д. 15",
                                                "+7 (495) 000-02-02", "north@supersto.ru",
                                                "Северный филиал сети СуперСТО, специализация - кузовной ремонт",
                                                "09:00", "21:00"),
                                createServiceStation("СуперСТО Восток", "г. Москва, ул. Восточная, д. 25",
                                                "+7 (495) 000-03-03", "east@supersto.ru",
                                                "Восточный филиал, экспресс-сервис и шиномонтаж", "07:00", "22:00"));

                serviceStationRepository.saveAll(stations);
                log.info("✅ Создано {} СТО", serviceStationRepository.count());
        }

        private ServiceStation createServiceStation(String name, String address, String phone,
                        String email, String description, String startTime, String endTime) {
                ServiceStation station = new ServiceStation();
                station.setName(name);
                station.setAddress(address);
                station.setPhone(phone);
                station.setEmail(email);
                station.setDescription(description);

                WorkingHours hours = new WorkingHours();
                hours.setStart(startTime);
                hours.setEnd(endTime);
                station.setWorkingHours(hours);

                station.setCreatedAt(randomPastDate(365));
                station.setUpdatedAt(LocalDateTime.now());
                return station;
        }

        private void createServices() {
                log.info("🔧 Создание расширенного списка услуг...");

                List<Service> services = Arrays.asList(
                                // Диагностика
                                createService("Компьютерная диагностика двигателя",
                                                "Полная диагностика электронных систем двигателя с распечаткой кодов ошибок",
                                                45, new BigDecimal("1500.0")),
                                createService("Диагностика ходовой части",
                                                "Проверка состояния подвески, амортизаторов, рулевого управления",
                                                60, new BigDecimal("1200.0")),
                                createService("Диагностика тормозной системы",
                                                "Проверка тормозных дисков, колодок, жидкости и магистралей",
                                                30, new BigDecimal("800.0")),

                                // Ремонт двигателя
                                createService("Замена масла и фильтров",
                                                "Замена моторного масла, масляного и воздушного фильтров",
                                                60, new BigDecimal("2500.0")),
                                createService("Замена ремня ГРМ",
                                                "Замена ремня газораспределительного механизма с роликами",
                                                240, new BigDecimal("8500.0")),
                                createService("Ремонт системы охлаждения",
                                                "Замена радиатора, термостата, патрубков системы охлаждения",
                                                180, new BigDecimal("6500.0")),
                                createService("Капитальный ремонт двигателя",
                                                "Полная разборка и сборка двигателя с заменой поршневой группы",
                                                1440, new BigDecimal("85000.0")),

                                // Электрика
                                createService("Замена аккумулятора",
                                                "Замена аккумуляторной батареи с проверкой генератора",
                                                30, new BigDecimal("3500.0")),
                                createService("Ремонт генератора",
                                                "Диагностика и ремонт генератора переменного тока",
                                                120, new BigDecimal("4500.0")),
                                createService("Замена стартера",
                                                "Снятие, диагностика и установка стартера",
                                                90, new BigDecimal("5500.0")),

                                // Кузовной ремонт
                                createService("Покраска элемента кузова",
                                                "Покраска одного элемента кузова (дверь, крыло, бампер)",
                                                480, new BigDecimal("12000.0")),
                                createService("Рихтовка после ДТП",
                                                "Восстановление геометрии кузова после аварии",
                                                720, new BigDecimal("25000.0")),
                                createService("Полировка кузова",
                                                "Абразивная полировка с защитным покрытием",
                                                240, new BigDecimal("8500.0")),

                                // Шиномонтаж
                                createService("Замена колес",
                                                "Снятие и установка 4-х колес с балансировкой",
                                                45, new BigDecimal("1600.0")),
                                createService("Ремонт проколов",
                                                "Ремонт проколов в шине методом жгутования",
                                                20, new BigDecimal("800.0")),
                                createService("Балансировка колес",
                                                "Балансировка 4-х колес на станке",
                                                30, new BigDecimal("1200.0")),

                                // ТО
                                createService("ТО-1 (15000 км)",
                                                "Плановое техническое обслуживание - замена масла, фильтров, проверка систем",
                                                120, new BigDecimal("5500.0")),
                                createService("ТО-2 (30000 км)",
                                                "Расширенное ТО с заменой свечей, проверкой тормозов",
                                                180, new BigDecimal("8500.0")),
                                createService("ТО-3 (60000 км)",
                                                "Полное ТО с заменой ремней, жидкостей, диагностикой",
                                                240, new BigDecimal("12500.0")));

                serviceRepository.saveAll(services);
                log.info("✅ Создано {} услуг", serviceRepository.count());
        }

        private Service createService(String name, String description, int duration, BigDecimal price) {
                Service service = new Service();
                service.setName(name);
                service.setDescription(description);
                service.setDuration(duration);
                service.setPrice(price);
                service.setCreatedAt(randomPastDate(365));
                return service;
        }

        private void createProducts() {
                log.info("🛒 Создание большого ассортимента продуктов...");

                List<Product> products = Arrays.asList(
                                // Масла
                                createProduct("Castrol GTX 5W-30",
                                                "Высококачественное моторное масло для бензиновых двигателей",
                                                new BigDecimal("2800.0"), 25, ProductCategory.OILS_FLUIDS, "Castrol",
                                                "CAST-GTX-5W30-4L"),
                                createProduct("Mobil 1 0W-20", "Синтетическое моторное масло премиум класса",
                                                new BigDecimal("4500.0"), 18, ProductCategory.OILS_FLUIDS, "Mobil",
                                                "MOBIL-1-0W20-4L"),
                                createProduct("Shell Helix Ultra 5W-40", "Полностью синтетическое моторное масло",
                                                new BigDecimal("3800.0"), 32, ProductCategory.OILS_FLUIDS, "Shell",
                                                "SHELL-HU-5W40-4L"),

                                // Фильтры
                                createProduct("Фильтр масляный Mann W 712/75",
                                                "Оригинальный масляный фильтр для BMW, Mercedes",
                                                new BigDecimal("850.0"), 45, ProductCategory.FILTERS, "Mann",
                                                "MANN-W712-75"),
                                createProduct("Фильтр воздушный Bosch 1987429404",
                                                "Воздушный фильтр для Volkswagen, Audi",
                                                new BigDecimal("1200.0"), 28, ProductCategory.FILTERS, "Bosch",
                                                "BOSCH-1987429404"),
                                createProduct("Фильтр топливный Mahle KL 756",
                                                "Топливный фильтр для дизельных двигателей",
                                                new BigDecimal("1650.0"), 22, ProductCategory.FILTERS, "Mahle",
                                                "MAHLE-KL756"),

                                // Тормозные колодки
                                createProduct("Колодки тормозные Brembo P 85 020",
                                                "Передние тормозные колодки для BMW 3 серии",
                                                new BigDecimal("4500.0"), 15, ProductCategory.BRAKE_PARTS, "Brembo",
                                                "BREMBO-P85020"),
                                createProduct("Колодки тормозные ATE 13.0460-7215.2",
                                                "Задние тормозные колодки для Mercedes C-класс",
                                                new BigDecimal("3200.0"), 19, ProductCategory.BRAKE_PARTS, "ATE",
                                                "ATE-13046072152"),

                                // Аккумуляторы
                                createProduct("Аккумулятор Bosch S4 005 60Ah",
                                                "Стартерный аккумулятор 60А/ч для легковых автомобилей",
                                                new BigDecimal("8500.0"), 12, ProductCategory.ELECTRICAL_PARTS, "Bosch",
                                                "BOSCH-S4005-60AH"),
                                createProduct("Аккумулятор Varta Blue Dynamic E11 74Ah",
                                                "Аккумулятор повышенной емкости для современных авто",
                                                new BigDecimal("10200.0"), 8, ProductCategory.ELECTRICAL_PARTS, "Varta",
                                                "VARTA-E11-74AH"),

                                // Шины
                                createProduct("Michelin Pilot Sport 4 225/45 R17",
                                                "Летние шины премиум класса для спортивного вождения",
                                                new BigDecimal("12500.0"), 20, ProductCategory.TIRES_WHEELS, "Michelin",
                                                "MICH-PS4-225-45-R17"),
                                createProduct("Continental WinterContact TS 860 205/55 R16",
                                                "Зимние шины с отличным сцеплением на снегу и льду",
                                                new BigDecimal("8900.0"), 24, ProductCategory.TIRES_WHEELS,
                                                "Continental", "CONT-WC860-205-55-R16"),

                                // Свечи
                                createProduct("Свечи NGK Iridium IX BKR6EIX",
                                                "Иридиевые свечи зажигания увеличенного ресурса",
                                                new BigDecimal("1800.0"), 40, ProductCategory.ELECTRICAL_PARTS, "NGK",
                                                "NGK-BKR6EIX"),
                                createProduct("Свечи Bosch Platinum Plus FR7DPP332",
                                                "Платиновые свечи для бензиновых двигателей",
                                                new BigDecimal("1200.0"), 35, ProductCategory.ELECTRICAL_PARTS, "Bosch",
                                                "BOSCH-FR7DPP332"),

                                // Прочее
                                createProduct("Незамерзающая жидкость -30°C",
                                                "Стеклоомывающая жидкость для зимнего периода",
                                                new BigDecimal("350.0"), 150, ProductCategory.OILS_FLUIDS, "Arctic",
                                                "ARCTIC-WASH-30-4L"));

                productRepository.saveAll(products);
                log.info("✅ Создано {} продуктов", productRepository.count());
        }

        private Product createProduct(String name, String description, BigDecimal price, int quantity,
                        ProductCategory category, String brand, String partNumber) {
                return Product.builder()
                                .name(name)
                                .description(description)
                                .price(price)
                                .quantity(quantity)
                                .category(category)
                                .brand(brand)
                                .partNumber(partNumber)
                                .isActive(true)
                                .createdAt(randomPastDate(200))
                                .build();
        }

        private void createAppointments() {
                log.info("📅 Создание множества записей на услуги...");

                List<User> clients = userRepository.findByRole(UserRole.CLIENT);
                List<User> masters = userRepository.findByRole(UserRole.MASTER);
                List<Service> services = serviceRepository.findAll();

                if (clients.isEmpty() || masters.isEmpty() || services.isEmpty()) {
                        log.warn("⚠️ Недостаточно данных для создания записей");
                        return;
                }

                List<Appointment> appointments = new ArrayList<>();
                AppointmentStatus[] statuses = AppointmentStatus.values();

                // Создаем 100 записей
                for (int i = 0; i < 100; i++) {
                        User client = clients.get(random.nextInt(clients.size()));
                        User master = masters.get(random.nextInt(masters.size()));
                        Service service = services.get(random.nextInt(services.size()));

                        LocalDateTime appointmentDate = i < 30 ? randomPastDate(30) : randomFutureDate(60);
                        AppointmentStatus status = i < 20 ? AppointmentStatus.COMPLETED
                                        : statuses[random.nextInt(statuses.length)];

                        appointments.add(createAppointment(client, master, service, appointmentDate, status));
                }

                appointmentRepository.saveAll(appointments);
                log.info("✅ Создано {} записей", appointmentRepository.count());
        }

        private Appointment createAppointment(User client, User master, Service service,
                        LocalDateTime dateTime, AppointmentStatus status) {
                return Appointment.builder()
                                .client(client)
                                .master(master)
                                .service(service)
                                .appointmentDate(dateTime)
                                .status(status)
                                .description(random.nextInt(5) == 0 ? "Клиент просил особое внимание к диагностике"
                                                : "")
                                .totalPrice(service.getPrice())
                                .createdAt(randomPastDate(60))
                                .build();
        }

        private void createOrders() {
                log.info("🛍️ Создание множества заказов...");

                List<User> clients = userRepository.findByRole(UserRole.CLIENT);
                List<Product> products = productRepository.findAll();

                if (clients.isEmpty() || products.isEmpty()) {
                        log.warn("⚠️ Недостаточно данных для создания заказов");
                        return;
                }

                List<Order> orders = new ArrayList<>();
                OrderStatus[] statuses = OrderStatus.values();

                // Создаем 50 заказов
                for (int i = 0; i < 50; i++) {
                        User client = clients.get(random.nextInt(clients.size()));
                        int itemCount = random.nextInt(4) + 1; // 1-4 товара в заказе
                        List<Product> orderProducts = new ArrayList<>();

                        for (int j = 0; j < itemCount; j++) {
                                Product product = products.get(random.nextInt(products.size()));
                                if (!orderProducts.contains(product)) {
                                        orderProducts.add(product);
                                }
                        }

                        OrderStatus status = i < 15 ? OrderStatus.DELIVERED : statuses[random.nextInt(statuses.length)];
                        orders.add(createOrder(client, orderProducts, status));
                }

                orderRepository.saveAll(orders);
                log.info("✅ Создано {} заказов", orderRepository.count());
        }

        private Order createOrder(User client, List<Product> productList, OrderStatus status) {
                List<OrderItem> items = productList.stream().map(product -> {
                        OrderItem item = OrderItem.builder()
                                        .product(product)
                                        .quantity(random.nextInt(3) + 1)
                                        .unitPrice(product.getPrice())
                                        .build();
                        item.calculateTotalPrice();
                        return item;
                }).toList();

                String[] streets = { "Ленина", "Пушкина", "Тверская", "Арбат", "Садовая" };
                String address = String.format("г. Москва, ул. %s, д. %d",
                                streets[random.nextInt(streets.length)], random.nextInt(100) + 1);

                Order order = Order.builder()
                                .client(client)
                                .items(items)
                                .status(status)
                                .shippingAddress(address)
                                .contactPhone(client.getPhone())
                                .notes("Автоматически созданный заказ")
                                .createdAt(randomPastDate(90))
                                .build();

                order.calculateTotalAmount();
                return order;
        }

        private void createReviews() {
                log.info("⭐ Создание отзывов...");

                List<Appointment> completedAppointments = appointmentRepository
                                .findByStatus(AppointmentStatus.COMPLETED);

                if (completedAppointments.isEmpty()) {
                        log.warn("⚠️ Нет завершенных записей для создания отзывов");
                        return;
                }

                String[] reviewTexts = {
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
                };

                List<Review> reviews = new ArrayList<>();
                int reviewCount = Math.min(completedAppointments.size(), 40);

                for (int i = 0; i < reviewCount; i++) {
                        Appointment appointment = completedAppointments.get(i);
                        int rating = random.nextInt(2) + 4; // 4-5 звезд
                        String comment = reviewTexts[random.nextInt(reviewTexts.length)];

                        reviews.add(createReview(appointment.getClient(), appointment, rating, comment));
                }

                reviewRepository.saveAll(reviews);
                log.info("✅ Создано {} отзывов", reviewRepository.count());
        }

        private Review createReview(User client, Appointment appointment, int rating, String comment) {
                return Review.builder()
                                .client(client)
                                .appointment(appointment)
                                .rating(rating)
                                .comment(comment)
                                .isVisible(true)
                                .createdAt(appointment.getAppointmentDate().plusDays(random.nextInt(7) + 1))
                                .build();
        }

        private void createChatMessages() {
                log.info("💬 Создание сообщений чата...");

                List<User> clients = userRepository.findByRole(UserRole.CLIENT);
                List<User> masters = userRepository.findByRole(UserRole.MASTER);

                if (clients.isEmpty() || masters.isEmpty()) {
                        log.warn("⚠️ Недостаточно данных для создания сообщений");
                        return;
                }

                String[] messageTexts = {
                                "Здравствуйте! Запись подтверждена на завтра в 10:00",
                                "Спасибо за обращение! Мастер уже готовит рабочее место",
                                "Добрый день! Можете подъехать, мы готовы принять ваш автомобиль",
                                "Диагностика завершена. Обнаружена неисправность генератора",
                                "Запчасть заказана, ожидаем поставку в течение 2 дней",
                                "Работы выполнены. Можете забирать автомобиль",
                                "Спасибо за отзыв! Рады были помочь",
                                "Не забудьте про следующее ТО через 15000 км",
                                "У нас действует скидка 10% на масла до конца месяца"
                };

                List<ChatMessage> messages = new ArrayList<>();

                // Создаем 150 сообщений
                for (int i = 0; i < 150; i++) {
                        boolean isFromClient = random.nextBoolean();
                        User sender = isFromClient ? clients.get(random.nextInt(clients.size()))
                                        : masters.get(random.nextInt(masters.size()));
                        User recipient = isFromClient ? masters.get(random.nextInt(masters.size()))
                                        : clients.get(random.nextInt(clients.size()));

                        String content = messageTexts[random.nextInt(messageTexts.length)];

                        messages.add(createChatMessage(sender, recipient, content));
                }

                chatMessageRepository.saveAll(messages);
                log.info("✅ Создано {} сообщений", chatMessageRepository.count());
        }

        private ChatMessage createChatMessage(User sender, User recipient, String content) {
                return ChatMessage.builder()
                                .sender(sender)
                                .recipient(recipient)
                                .content(content)
                                .type(ChatMessageType.TEXT)
                                .isRead(random.nextDouble() > 0.3)
                                .createdAt(randomPastDate(60))
                                .build();
        }

        private void createNotifications() {
                log.info("🔔 Создание уведомлений...");

                List<User> allUsers = userRepository.findAll();

                if (allUsers.isEmpty()) {
                        log.warn("⚠️ Нет пользователей для создания уведомлений");
                        return;
                }

                String[] notificationTexts = {
                                "Ваша запись подтверждена",
                                "Напоминание о записи завтра",
                                "Работы по вашему автомобилю завершены",
                                "Ваш заказ отправлен",
                                "Получен новый отзыв",
                                "Акция: скидка 15% на все масла",
                                "Не забудьте про плановое ТО",
                                "Новое сообщение от мастера",
                                "Ваш заказ доставлен"
                };

                NotificationType[] types = { NotificationType.INFO, NotificationType.SUCCESS,
                                NotificationType.WARNING };
                List<Notification> notifications = new ArrayList<>();

                // Создаем 200 уведомлений
                for (int i = 0; i < 200; i++) {
                        User user = allUsers.get(random.nextInt(allUsers.size()));
                        String message = notificationTexts[random.nextInt(notificationTexts.length)];
                        NotificationType type = types[random.nextInt(types.length)];

                        notifications.add(createNotification(user, "Уведомление", message, type));
                }

                notificationRepository.saveAll(notifications);
                log.info("✅ Создано {} уведомлений", notificationRepository.count());
        }

        private Notification createNotification(User user, String title, String message, NotificationType type) {
                return Notification.builder()
                                .recipient(user)
                                .title(title)
                                .message(message)
                                .type(type)
                                .isRead(random.nextDouble() > 0.4)
                                .createdAt(randomPastDate(30))
                                .build();
        }

        private LocalDateTime randomPastDate(int daysAgo) {
                return LocalDateTime.now().minusDays(random.nextInt(daysAgo));
        }

        private LocalDateTime randomFutureDate(int daysAhead) {
                return LocalDateTime.now().plusDays(random.nextInt(daysAhead));
        }

        private void printStatistics() {
                log.info("📊 Статистика созданных данных:");
                log.info("   👥 Пользователи: {}", userRepository.count());
                log.info("   🏢 СТО: {}", serviceStationRepository.count());
                log.info("   🔧 Услуги: {}", serviceRepository.count());
                log.info("   🛒 Продукты: {}", productRepository.count());
                log.info("   📅 Записи: {}", appointmentRepository.count());
                log.info("   🛍️ Заказы: {}", orderRepository.count());
                log.info("   ⭐ Отзывы: {}", reviewRepository.count());
                log.info("   💬 Сообщения: {}", chatMessageRepository.count());
                log.info("   🔔 Уведомления: {}", notificationRepository.count());
        }
}