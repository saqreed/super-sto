package ru.supersto.dto.analytics;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class MasterPerformanceDTO {

    private String masterId;
    private String masterName;
    private String masterEmail;

    private Integer totalAppointments; // Общее количество записей
    private Integer completedAppointments; // Завершенные записи
    private Integer cancelledAppointments; // Отмененные записи

    private BigDecimal totalRevenue; // Общий доход
    private BigDecimal averageRevenue; // Средний доход за запись

    private Double averageRating; // Средний рейтинг
    private Long totalReviews; // Количество отзывов

    private Double completionRate; // Процент завершения (%)
    private Double cancellationRate; // Процент отмены (%)

    private Integer workingDays; // Количество рабочих дней
    private Double appointmentsPerDay; // Среднее количество записей в день

    private String topServiceCategory; // Самая популярная категория услуг
    private Integer topServiceCount; // Количество записей в топ категории
}