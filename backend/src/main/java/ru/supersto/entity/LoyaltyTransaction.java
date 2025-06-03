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

@Document(collection = "loyalty_transactions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoyaltyTransaction {

    @Id
    private String id;

    @DBRef
    private User user;

    private LoyaltyTransactionType type; // EARNED, SPENT, EXPIRED, BONUS

    private Integer points;

    private String description;

    @Field("reference_id")
    private String referenceId; // ID связанной записи/заказа

    @Field("reference_type")
    private String referenceType; // "APPOINTMENT", "ORDER", "BONUS"

    @Field("order_amount")
    private BigDecimal orderAmount; // Сумма заказа для расчета баллов

    @Field("expiry_date")
    private LocalDateTime expiryDate; // Дата истечения баллов

    @Field("created_at")
    private LocalDateTime createdAt;

    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        // Баллы действительны 1 год
        if (expiryDate == null && type == LoyaltyTransactionType.EARNED) {
            expiryDate = createdAt.plusYears(1);
        }
    }
}