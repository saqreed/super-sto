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
import java.util.List;

@Document(collection = "orders")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    private String id;

    @DBRef
    private User client;

    private List<OrderItem> items;

    private OrderStatus status;

    @Field("total_amount")
    private BigDecimal totalAmount;

    @Field("shipping_address")
    private String shippingAddress;

    @Field("contact_phone")
    private String contactPhone;

    private String notes;

    @Field("created_at")
    private LocalDateTime createdAt;

    @Field("confirmed_at")
    private LocalDateTime confirmedAt;

    @Field("shipped_at")
    private LocalDateTime shippedAt;

    @Field("delivered_at")
    private LocalDateTime deliveredAt;

    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (status == null) {
            status = OrderStatus.PENDING;
        }
        calculateTotalAmount();
    }

    public void calculateTotalAmount() {
        if (items != null && !items.isEmpty()) {
            totalAmount = items.stream()
                    .map(OrderItem::getTotalPrice)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
        }
    }
}