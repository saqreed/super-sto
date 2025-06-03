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

@Document(collection = "chat_messages")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {

    @Id
    private String id;

    @DBRef
    private User sender;

    @DBRef
    private User recipient;

    private String content;

    private ChatMessageType type; // TEXT, IMAGE, FILE

    @Field("appointment_id")
    private String appointmentId; // ID связанной записи (если есть)

    @Field("is_read")
    private Boolean isRead;

    @Field("created_at")
    private LocalDateTime createdAt;

    @Field("read_at")
    private LocalDateTime readAt;

    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (isRead == null) {
            isRead = false;
        }
    }

    public void markAsRead() {
        this.isRead = true;
        this.readAt = LocalDateTime.now();
    }
}