package ru.supersto.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Document(collection = "products")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    private String id;

    private String name;

    private String description;

    private BigDecimal price;

    private Integer quantity;

    private ProductCategory category;

    private String brand;

    @Indexed(unique = true)
    @Field("part_number")
    private String partNumber;

    @Field("is_active")
    private Boolean isActive;

    @Field("created_at")
    private LocalDateTime createdAt;

    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (isActive == null) {
            isActive = true;
        }
        if (quantity == null) {
            quantity = 0;
        }
    }
}