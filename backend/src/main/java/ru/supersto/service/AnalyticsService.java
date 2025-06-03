package ru.supersto.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ru.supersto.dto.analytics.*;
import ru.supersto.entity.*;
import ru.supersto.repository.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyticsService {

    private final AppointmentRepository appointmentRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final ProductRepository productRepository;
    private final ReviewRepository reviewRepository;

    public DashboardStatsDTO getDashboardStats() {
        LocalDateTime today = LocalDate.now().atStartOfDay();
        LocalDateTime monthStart = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime yearStart = LocalDate.now().withDayOfYear(1).atStartOfDay();

        // Основные метрики
        BigDecimal todayRevenue = calculateRevenueForPeriod(today, today.plusDays(1));
        BigDecimal monthRevenue = calculateRevenueForPeriod(monthStart, LocalDateTime.now());
        BigDecimal yearRevenue = calculateRevenueForPeriod(yearStart, LocalDateTime.now());

        // Записи
        int todayAppointments = appointmentRepository.findByDateRange(today, today.plusDays(1)).size();
        int monthAppointments = appointmentRepository.findByDateRange(monthStart, LocalDateTime.now()).size();

        // Пользователи
        int activeClients = userRepository.findByRole(UserRole.CLIENT).size();
        int totalMasters = userRepository.findByRole(UserRole.MASTER).size();

        // Заказы
        int pendingOrders = orderRepository.findByStatus(OrderStatus.PENDING).size();
        int shippedOrders = orderRepository.findByStatus(OrderStatus.SHIPPED).size();

        // Товары с низким остатком
        int lowStockProducts = productRepository.findLowStock(10).size();

        // Рейтинги
        List<Review> allReviews = reviewRepository.findAllVisible();
        Double averageServiceRating = allReviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
        long newReviewsToday = reviewRepository.findByDateRange(today, today.plusDays(1)).size();

        // Топ списки
        List<ServicePopularityDTO> topServices = getTopServices(5);
        List<MasterPerformanceDTO> topMasters = getTopMasters(5);

        // Рост
        BigDecimal previousMonthRevenue = calculateRevenueForPeriod(
                monthStart.minusMonths(1), monthStart);
        double revenueGrowth = calculateGrowthPercentage(monthRevenue, previousMonthRevenue);

        return DashboardStatsDTO.builder()
                .todayRevenue(todayRevenue)
                .monthRevenue(monthRevenue)
                .yearRevenue(yearRevenue)
                .todayAppointments(todayAppointments)
                .monthAppointments(monthAppointments)
                .activeClients(activeClients)
                .totalMasters(totalMasters)
                .pendingOrders(pendingOrders)
                .shippedOrders(shippedOrders)
                .lowStockProducts(lowStockProducts)
                .averageServiceRating(Math.round(averageServiceRating * 10.0) / 10.0)
                .totalReviews((long) allReviews.size())
                .newReviewsToday(newReviewsToday)
                .topServices(topServices)
                .topMasters(topMasters)
                .revenueGrowth(revenueGrowth)
                .build();
    }

    public RevenueStatsDTO getRevenueStats(LocalDateTime startDate, LocalDateTime endDate) {
        List<Appointment> appointments = appointmentRepository.findByDateRange(startDate, endDate);
        List<Order> orders = orderRepository.findByDateRange(startDate, endDate);

        // Доходы от записей
        BigDecimal appointmentRevenue = appointments.stream()
                .filter(a -> a.getStatus() == AppointmentStatus.COMPLETED)
                .map(Appointment::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Доходы от заказов
        BigDecimal orderRevenue = orders.stream()
                .filter(o -> o.getStatus() == OrderStatus.DELIVERED)
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalRevenue = appointmentRevenue.add(orderRevenue);

        // Средние чеки
        BigDecimal averageOrderValue = orders.isEmpty() ? BigDecimal.ZERO
                : orderRevenue.divide(BigDecimal.valueOf(orders.size()), 2, RoundingMode.HALF_UP);

        BigDecimal averageAppointmentValue = appointments.isEmpty() ? BigDecimal.ZERO
                : appointmentRevenue.divide(BigDecimal.valueOf(appointments.size()), 2, RoundingMode.HALF_UP);

        // Статистика
        int completedAppointments = (int) appointments.stream()
                .filter(a -> a.getStatus() == AppointmentStatus.COMPLETED)
                .count();

        int deliveredOrders = (int) orders.stream()
                .filter(o -> o.getStatus() == OrderStatus.DELIVERED)
                .count();

        // Рост
        long periodDays = java.time.Duration.between(startDate, endDate).toDays();
        LocalDateTime previousStart = startDate.minusDays(periodDays);
        LocalDateTime previousEnd = startDate;
        BigDecimal previousRevenue = calculateRevenueForPeriod(previousStart, previousEnd);
        double growthPercentage = calculateGrowthPercentage(totalRevenue, previousRevenue);

        return RevenueStatsDTO.builder()
                .totalRevenue(totalRevenue)
                .appointmentRevenue(appointmentRevenue)
                .orderRevenue(orderRevenue)
                .averageOrderValue(averageOrderValue)
                .averageAppointmentValue(averageAppointmentValue)
                .totalAppointments(appointments.size())
                .completedAppointments(completedAppointments)
                .totalOrders(orders.size())
                .deliveredOrders(deliveredOrders)
                .periodStart(startDate)
                .periodEnd(endDate)
                .growthPercentage(growthPercentage)
                .previousPeriodRevenue(previousRevenue)
                .build();
    }

    public List<MasterPerformanceDTO> getTopMasters(int limit) {
        List<User> masters = userRepository.findByRole(UserRole.MASTER);

        return masters.stream()
                .map(this::calculateMasterPerformance)
                .sorted((a, b) -> Double.compare(b.getCompletionRate(), a.getCompletionRate()))
                .limit(limit)
                .collect(Collectors.toList());
    }

    public MasterPerformanceDTO getMasterPerformance(String masterId, LocalDateTime startDate, LocalDateTime endDate) {
        User master = userRepository.findById(masterId)
                .orElseThrow(() -> new RuntimeException("Мастер не найден"));

        List<Appointment> appointments = appointmentRepository.findByMasterAndDateRange(
                masterId, startDate, endDate);

        return calculateMasterPerformanceForPeriod(master, appointments);
    }

    public List<ServicePopularityDTO> getTopServices(int limit) {
        List<ru.supersto.entity.Service> services = serviceRepository.findAllActive();

        return services.stream()
                .map(this::calculateServicePopularity)
                .sorted((a, b) -> Double.compare(b.getPopularityScore(), a.getPopularityScore()))
                .limit(limit)
                .collect(Collectors.toList());
    }

    private BigDecimal calculateRevenueForPeriod(LocalDateTime start, LocalDateTime end) {
        List<Appointment> appointments = appointmentRepository.findByDateRange(start, end);
        List<Order> orders = orderRepository.findByDateRange(start, end);

        BigDecimal appointmentRevenue = appointments.stream()
                .filter(a -> a.getStatus() == AppointmentStatus.COMPLETED)
                .map(Appointment::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal orderRevenue = orders.stream()
                .filter(o -> o.getStatus() == OrderStatus.DELIVERED)
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return appointmentRevenue.add(orderRevenue);
    }

    private double calculateGrowthPercentage(BigDecimal current, BigDecimal previous) {
        if (previous.equals(BigDecimal.ZERO)) {
            return current.equals(BigDecimal.ZERO) ? 0.0 : 100.0;
        }

        return current.subtract(previous)
                .divide(previous, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .doubleValue();
    }

    private MasterPerformanceDTO calculateMasterPerformance(User master) {
        List<Appointment> appointments = appointmentRepository.findByMasterId(master.getId());
        return calculateMasterPerformanceForPeriod(master, appointments);
    }

    private MasterPerformanceDTO calculateMasterPerformanceForPeriod(User master, List<Appointment> appointments) {
        int totalAppointments = appointments.size();
        int completedAppointments = (int) appointments.stream()
                .filter(a -> a.getStatus() == AppointmentStatus.COMPLETED)
                .count();
        int cancelledAppointments = (int) appointments.stream()
                .filter(a -> a.getStatus() == AppointmentStatus.CANCELLED)
                .count();

        BigDecimal totalRevenue = appointments.stream()
                .filter(a -> a.getStatus() == AppointmentStatus.COMPLETED)
                .map(Appointment::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal averageRevenue = totalAppointments > 0
                ? totalRevenue.divide(BigDecimal.valueOf(totalAppointments), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        // Рейтинг мастера
        List<Review> reviews = reviewRepository.findByMasterIdAndVisible(master.getId());
        Double averageRating = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        double completionRate = totalAppointments > 0 ? (double) completedAppointments / totalAppointments * 100 : 0.0;

        double cancellationRate = totalAppointments > 0 ? (double) cancelledAppointments / totalAppointments * 100
                : 0.0;

        return MasterPerformanceDTO.builder()
                .masterId(master.getId())
                .masterName(master.getFirstName() + " " + master.getLastName())
                .masterEmail(master.getEmail())
                .totalAppointments(totalAppointments)
                .completedAppointments(completedAppointments)
                .cancelledAppointments(cancelledAppointments)
                .totalRevenue(totalRevenue)
                .averageRevenue(averageRevenue)
                .averageRating(Math.round(averageRating * 10.0) / 10.0)
                .totalReviews((long) reviews.size())
                .completionRate(Math.round(completionRate * 10.0) / 10.0)
                .cancellationRate(Math.round(cancellationRate * 10.0) / 10.0)
                .build();
    }

    private ServicePopularityDTO calculateServicePopularity(ru.supersto.entity.Service service) {
        List<Appointment> appointments = appointmentRepository.findByServiceId(service.getId());

        int totalBookings = appointments.size();
        int completedBookings = (int) appointments.stream()
                .filter(a -> a.getStatus() == AppointmentStatus.COMPLETED)
                .count();
        int cancelledBookings = (int) appointments.stream()
                .filter(a -> a.getStatus() == AppointmentStatus.CANCELLED)
                .count();

        BigDecimal totalRevenue = appointments.stream()
                .filter(a -> a.getStatus() == AppointmentStatus.COMPLETED)
                .map(Appointment::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Рейтинг услуги
        List<Review> reviews = reviewRepository.findByServiceIdAndVisible(service.getId());
        Double averageRating = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        double completionRate = totalBookings > 0 ? (double) completedBookings / totalBookings * 100 : 0.0;

        // Индекс популярности (учитывает количество бронирований, рейтинг, процент
        // завершения)
        double popularityScore = (totalBookings * 0.4) + (averageRating * 10 * 0.3) + (completionRate * 0.3);

        return ServicePopularityDTO.builder()
                .serviceId(service.getId())
                .serviceName(service.getName())
                .serviceDescription(service.getDescription())
                .category(service.getCategory())
                .price(service.getPrice())
                .totalBookings(totalBookings)
                .completedBookings(completedBookings)
                .cancelledBookings(cancelledBookings)
                .totalRevenue(totalRevenue)
                .averageRating(Math.round(averageRating * 10.0) / 10.0)
                .totalReviews((long) reviews.size())
                .completionRate(Math.round(completionRate * 10.0) / 10.0)
                .popularityScore(Math.round(popularityScore * 10.0) / 10.0)
                .build();
    }
}