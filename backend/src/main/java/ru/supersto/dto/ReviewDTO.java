package ru.supersto.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ReviewDTO {

    private String id;

    private String clientId;

    private String masterId;

    private String serviceId;

    @NotBlank(message = "ID записи обязателен")
    private String appointmentId;

    @NotNull(message = "Рейтинг обязателен")
    @Min(value = 1, message = "Рейтинг должен быть от 1 до 5")
    @Max(value = 5, message = "Рейтинг должен быть от 1 до 5")
    private Integer rating;

    @NotBlank(message = "Комментарий не может быть пустым")
    private String comment;

    private Boolean isVisible;

    // Информация для отображения
    private String clientName;
    private String clientEmail;
    private String masterName;
    private String serviceName;
    private String serviceDescription;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}