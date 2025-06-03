package ru.supersto.dto.reports;

import lombok.Builder;
import lombok.Data;
import ru.supersto.entity.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderReportDTO {

    private String orderId;
    private OrderStatus status;

    // Клиент
    private String clientName;
    private String clientEmail;
    private String clientPhone;

    // Доставка
    private String shippingAddress;
    private String contactPhone;

    // Товары
    private Integer totalItems;
    private List<OrderItemReportDTO> items;

    // Финансы
    private BigDecimal totalAmount;

    // Время
    private LocalDateTime createdAt;
    private LocalDateTime confirmedAt;
    private LocalDateTime shippedAt;
    private LocalDateTime deliveredAt;

    // Дополнительно
    private String notes;

    @Data
    @Builder
    public static class OrderItemReportDTO {
        private String productName;
        private String productPartNumber;
        private String productBrand;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal totalPrice;
    }
}