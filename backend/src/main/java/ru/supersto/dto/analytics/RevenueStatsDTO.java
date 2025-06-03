package ru.supersto.dto.analytics;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class RevenueStatsDTO {

    private BigDecimal totalRevenue; // Общий доход
    private BigDecimal appointmentRevenue; // Доход от записей
    private BigDecimal orderRevenue; // Доход от заказов
    private BigDecimal averageOrderValue; // Средний чек заказа
    private BigDecimal averageAppointmentValue; // Средний чек записи

    private Integer totalAppointments; // Количество записей
    private Integer completedAppointments; // Завершенные записи
    private Integer totalOrders; // Количество заказов
    private Integer deliveredOrders; // Доставленные заказы

    private LocalDateTime periodStart; // Начало периода
    private LocalDateTime periodEnd; // Конец периода

    private Double growthPercentage; // Рост в процентах
    private BigDecimal previousPeriodRevenue; // Доход предыдущего периода
}