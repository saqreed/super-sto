package ru.supersto.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import ru.supersto.entity.NotificationType;

import java.time.LocalDateTime;

@Data
@Builder
public class NotificationDTO {

    private String id;

    @NotBlank(message = "ID получателя обязателен")
    private String recipientId;
    private String recipientName;

    @NotBlank(message = "Заголовок обязателен")
    private String title;

    @NotBlank(message = "Сообщение обязательно")
    private String message;

    @NotNull(message = "Тип уведомления обязателен")
    private NotificationType type;

    private String referenceId; // ID связанной записи/заказа
    private String referenceType; // Тип связи

    private Boolean isRead;
    private String actionUrl; // URL для действия

    private LocalDateTime createdAt;
    private LocalDateTime readAt;
    private LocalDateTime expiresAt;
}