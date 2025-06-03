package ru.supersto.dto.analytics;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class DashboardStatsDTO {

    // Основные метрики
    private BigDecimal todayRevenue; // Доход за сегодня
    private BigDecimal monthRevenue; // Доход за месяц
    private BigDecimal yearRevenue; // Доход за год

    private Integer todayAppointments; // Записи сегодня
    private Integer monthAppointments; // Записи за месяц
    private Integer activeClients; // Активные клиенты
    private Integer totalMasters; // Общее количество мастеров

    // Статистика заказов
    private Integer pendingOrders; // Заказы в обработке
    private Integer shippedOrders; // Отправленные заказы
    private Integer lowStockProducts; // Товары с низким остатком

    // Рейтинги и отзывы
    private Double averageServiceRating; // Средний рейтинг услуг
    private Long totalReviews; // Общее количество отзывов
    private Long newReviewsToday; // Новые отзывы сегодня

    // Топ списки
    private List<ServicePopularityDTO> topServices; // Топ услуги
    private List<MasterPerformanceDTO> topMasters; // Топ мастера

    // Тренды
    private Double revenueGrowth; // Рост дохода (%)
    private Double appointmentGrowth; // Рост записей (%)
    private Double clientGrowth; // Рост клиентов (%)

    // Операционные метрики
    private Double averageAppointmentDuration; // Средняя длительность записи
    private Double masterUtilization; // Загрузка мастеров (%)
    private Integer completionRate; // Процент завершения записей
}