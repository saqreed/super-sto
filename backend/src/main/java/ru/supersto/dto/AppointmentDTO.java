package ru.supersto.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import ru.supersto.entity.AppointmentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class AppointmentDTO {

    private String id;

    @NotBlank(message = "ID клиента обязателен")
    private String clientId;

    private String masterId;

    @NotBlank(message = "ID услуги обязателен")
    private String serviceId;

    @NotNull(message = "Дата и время записи обязательны")
    @Future(message = "Дата записи должна быть в будущем")
    private LocalDateTime appointmentDate;

    private AppointmentStatus status;

    private String description;

    private BigDecimal totalPrice;

    // Информация для отображения (не для создания/обновления)
    private String clientName;
    private String clientEmail;
    private String clientPhone;
    private String masterName;
    private String serviceName;
    private String serviceDescription;

    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
}