package ru.supersto.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Document(collection = "notifications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    private String id;

    @DBRef
    private User recipient;

    private String title;
    private String message;
    private NotificationType type; // INFO, SUCCESS, WARNING, ERROR

    @Field("reference_id")
    private String referenceId; // ID связанной записи/заказа

    @Field("reference_type")
    private String referenceType; // "APPOINTMENT", "ORDER", "REVIEW", "SYSTEM"

    @Field("is_read")
    private Boolean isRead;

    @Field("action_url")
    private String actionUrl; // URL для перехода (опционально)

    @Field("created_at")
    private LocalDateTime createdAt;

    @Field("read_at")
    private LocalDateTime readAt;

    @Field("expires_at")
    private LocalDateTime expiresAt; // Дата истечения уведомления

    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (isRead == null) {
            isRead = false;
        }
        // Уведомления действительны 30 дней
        if (expiresAt == null) {
            expiresAt = createdAt.plusDays(30);
        }
    }

    public void markAsRead() {
        this.isRead = true;
        this.readAt = LocalDateTime.now();
    }

    public boolean isExpired() {
        return expiresAt != null && LocalDateTime.now().isAfter(expiresAt);
    }
}