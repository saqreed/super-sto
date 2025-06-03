package ru.supersto.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Document(collection = "appointments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {

    @Id
    private String id;

    @DBRef
    private User client;

    @DBRef
    private User master;

    @DBRef
    private Service service;

    @Field("appointment_date")
    private LocalDateTime appointmentDate;

    private AppointmentStatus status;

    private String description;

    @Field("total_price")
    private BigDecimal totalPrice;

    @Field("created_at")
    private LocalDateTime createdAt;

    @Field("completed_at")
    private LocalDateTime completedAt;

    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (status == null) {
            status = AppointmentStatus.PENDING;
        }
    }
}