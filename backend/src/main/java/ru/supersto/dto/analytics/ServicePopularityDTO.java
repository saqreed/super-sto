package ru.supersto.dto.analytics;

import lombok.Builder;
import lombok.Data;
import ru.supersto.entity.ServiceCategory;

import java.math.BigDecimal;

@Data
@Builder
public class ServicePopularityDTO {

    private String serviceId;
    private String serviceName;
    private String serviceDescription;
    private ServiceCategory category;
    private BigDecimal price;

    private Integer totalBookings; // Общее количество бронирований
    private Integer completedBookings; // Завершенные бронирования
    private Integer cancelledBookings; // Отмененные бронирования

    private BigDecimal totalRevenue; // Общий доход от услуги
    private BigDecimal averageRevenue; // Средний доход за бронирование

    private Double averageRating; // Средний рейтинг
    private Long totalReviews; // Количество отзывов

    private Double completionRate; // Процент завершения (%)
    private Double popularityScore; // Индекс популярности (0-100)

    private Integer rank; // Место в рейтинге популярности
    private String trendDirection; // Тренд: "UP", "DOWN", "STABLE"
}