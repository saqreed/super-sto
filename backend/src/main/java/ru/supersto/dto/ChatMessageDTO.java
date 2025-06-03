package ru.supersto.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import ru.supersto.entity.ChatMessageType;

import java.time.LocalDateTime;

@Data
@Builder
public class ChatMessageDTO {

    private String id;

    private String senderId;
    private String senderName;
    private String senderEmail;

    @NotBlank(message = "ID получателя обязателен")
    private String recipientId;
    private String recipientName;
    private String recipientEmail;

    @NotBlank(message = "Сообщение не может быть пустым")
    private String content;

    @NotNull(message = "Тип сообщения обязателен")
    private ChatMessageType type;

    private String appointmentId; // Связанная запись (опционально)

    private Boolean isRead;

    private LocalDateTime createdAt;
    private LocalDateTime readAt;
}