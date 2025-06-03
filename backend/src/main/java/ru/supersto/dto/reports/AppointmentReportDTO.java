package ru.supersto.dto.reports;

import lombok.Builder;
import lombok.Data;
import ru.supersto.entity.AppointmentStatus;
import ru.supersto.entity.ServiceCategory;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class AppointmentReportDTO {

    private String appointmentId;
    private LocalDateTime appointmentDate;
    private AppointmentStatus status;

    // Клиент
    private String clientName;
    private String clientEmail;
    private String clientPhone;

    // Мастер
    private String masterName;
    private String masterEmail;

    // Услуга
    private String serviceName;
    private ServiceCategory serviceCategory;
    private BigDecimal servicePrice;
    private Integer serviceDuration;

    // Финансы
    private BigDecimal totalPrice;

    // Время
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;

    // Дополнительно
    private String description;
    private Boolean hasReview;
    private Integer reviewRating;
}