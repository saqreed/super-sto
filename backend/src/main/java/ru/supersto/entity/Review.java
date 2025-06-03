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

@Document(collection = "reviews")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Review {

    @Id
    private String id;

    @DBRef
    private User client;

    @DBRef
    private User master;

    @DBRef
    private Service service;

    @DBRef
    private Appointment appointment;

    private Integer rating; // от 1 до 5

    private String comment;

    @Field("is_visible")
    private Boolean isVisible;

    @Field("created_at")
    private LocalDateTime createdAt;

    @Field("updated_at")
    private LocalDateTime updatedAt;

    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (isVisible == null) {
            isVisible = true;
        }
        updatedAt = LocalDateTime.now();
    }
}