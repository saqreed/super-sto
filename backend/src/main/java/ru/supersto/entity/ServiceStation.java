package ru.supersto.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Document(collection = "service_stations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceStation {

    @Id
    private String id;

    @Indexed(unique = true)
    private String name;

    private String address;

    @Indexed
    private String phone;

    private String email;

    private String description;

    @Field("working_hours")
    private WorkingHours workingHours;

    @Field("created_at")
    private LocalDateTime createdAt;

    @Field("updated_at")
    private LocalDateTime updatedAt;
}