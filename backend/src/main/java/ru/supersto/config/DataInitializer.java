package ru.supersto.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import ru.supersto.entity.*;
import ru.supersto.repository.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final ServiceStationRepository serviceStationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        log.info("🚀 Инициализация данных...");

        // Проверяем, есть ли уже данные
        if (userRepository.count() > 0) {
            log.info("✅ Данные уже существуют, пропускаем инициализацию");
            return;
        }

        createUsers();
        createServiceStations();
        createServices();

        log.info("✅ Инициализация данных завершена!");
    }

    private void createUsers() {
        log.info("👥 Создание пользователей...");

        // Администратор
        User admin = new User();
        admin.setEmail("admin@supersto.ru");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setFirstName("Админ");
        admin.setLastName("Супер СТО");
        admin.setPhone("+7 (999) 000-01-01");
        admin.setRole(UserRole.ADMIN);
        admin.setLoyaltyLevel(LoyaltyLevel.PLATINUM);
        admin.setLoyaltyPoints(5000);
        admin.setCreatedAt(LocalDateTime.now());
        userRepository.save(admin);

        // Мастер
        User master = new User();
        master.setEmail("master@supersto.ru");
        master.setPassword(passwordEncoder.encode("master123"));
        master.setFirstName("Иван");
        master.setLastName("Мастеров");
        master.setPhone("+7 (999) 000-02-02");
        master.setRole(UserRole.MASTER);
        master.setLoyaltyLevel(LoyaltyLevel.GOLD);
        master.setLoyaltyPoints(1500);
        master.setCreatedAt(LocalDateTime.now());
        userRepository.save(master);

        // Клиент 1
        User client1 = new User();
        client1.setEmail("client@supersto.ru");
        client1.setPassword(passwordEncoder.encode("client123"));
        client1.setFirstName("Петр");
        client1.setLastName("Клиентов");
        client1.setPhone("+7 (999) 000-03-03");
        client1.setRole(UserRole.CLIENT);
        client1.setLoyaltyLevel(LoyaltyLevel.SILVER);
        client1.setLoyaltyPoints(250);
        client1.setCreatedAt(LocalDateTime.now());
        userRepository.save(client1);

        // Клиент 2 (тот который пытался залогиниться)
        User client2 = new User();
        client2.setEmail("Redaer05@yandex.ru");
        client2.setPassword(passwordEncoder.encode("password123"));
        client2.setFirstName("Александр");
        client2.setLastName("Ридер");
        client2.setPhone("+7 (999) 000-04-04");
        client2.setRole(UserRole.CLIENT);
        client2.setLoyaltyLevel(LoyaltyLevel.BRONZE);
        client2.setLoyaltyPoints(50);
        client2.setCreatedAt(LocalDateTime.now());
        userRepository.save(client2);

        log.info("✅ Создано {} пользователей", userRepository.count());
    }

    private void createServiceStations() {
        log.info("🏢 Создание СТО...");

        ServiceStation station1 = new ServiceStation();
        station1.setName("СуперСТО Центр");
        station1.setAddress("г. Москва, ул. Центральная, д. 1");
        station1.setPhone("+7 (495) 000-01-01");
        station1.setEmail("center@supersto.ru");
        station1.setDescription("Основной центр обслуживания автомобилей");

        WorkingHours hours1 = new WorkingHours();
        hours1.setStart("08:00");
        hours1.setEnd("20:00");
        station1.setWorkingHours(hours1);

        station1.setCreatedAt(LocalDateTime.now());
        station1.setUpdatedAt(LocalDateTime.now());
        serviceStationRepository.save(station1);

        ServiceStation station2 = new ServiceStation();
        station2.setName("СуперСТО Север");
        station2.setAddress("г. Москва, ул. Северная, д. 15");
        station2.setPhone("+7 (495) 000-02-02");
        station2.setEmail("north@supersto.ru");
        station2.setDescription("Северный филиал сети СуперСТО");

        WorkingHours hours2 = new WorkingHours();
        hours2.setStart("09:00");
        hours2.setEnd("21:00");
        station2.setWorkingHours(hours2);

        station2.setCreatedAt(LocalDateTime.now());
        station2.setUpdatedAt(LocalDateTime.now());
        serviceStationRepository.save(station2);

        log.info("✅ Создано {} СТО", serviceStationRepository.count());
    }

    private void createServices() {
        log.info("🔧 Создание услуг...");

        List<Service> services = Arrays.asList(
                createService("Замена масла", "Замена моторного масла и масляного фильтра", 60,
                        new BigDecimal("2500.0")),
                createService("Диагностика двигателя", "Комплексная диагностика работы двигателя", 90,
                        new BigDecimal("3500.0")),
                createService("Замена тормозных колодок", "Замена передних или задних тормозных колодок", 120,
                        new BigDecimal("4500.0")),
                createService("Шиномонтаж", "Снятие/установка колес, балансировка", 45, new BigDecimal("1500.0")),
                createService("Замена свечей зажигания", "Замена комплекта свечей зажигания", 30,
                        new BigDecimal("2000.0")),
                createService("Регулировка развал-схождения", "Регулировка углов установки колес", 90,
                        new BigDecimal("3000.0")),
                createService("Замена воздушного фильтра", "Замена воздушного фильтра двигателя", 15,
                        new BigDecimal("800.0")),
                createService("Мойка автомобиля", "Комплексная мойка кузова и салона", 60, new BigDecimal("1200.0")));

        serviceRepository.saveAll(services);
        log.info("✅ Создано {} услуг", serviceRepository.count());
    }

    private Service createService(String name, String description, int duration, BigDecimal price) {
        Service service = new Service();
        service.setName(name);
        service.setDescription(description);
        service.setDuration(duration);
        service.setPrice(price);
        service.setCreatedAt(LocalDateTime.now());
        return service;
    }
}