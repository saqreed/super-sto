package ru.supersto.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Builder;
import lombok.Data;
import ru.supersto.entity.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderDTO {

    private String id;

    private String clientId;

    @NotEmpty(message = "Заказ должен содержать хотя бы один товар")
    @Valid
    private List<OrderItemDTO> items;

    private OrderStatus status;

    private BigDecimal totalAmount;

    @NotBlank(message = "Адрес доставки обязателен")
    private String shippingAddress;

    @NotBlank(message = "Контактный телефон обязателен")
    private String contactPhone;

    private String notes;

    // Информация о клиенте для отображения
    private String clientName;
    private String clientEmail;

    private LocalDateTime createdAt;
    private LocalDateTime confirmedAt;
    private LocalDateTime shippedAt;
    private LocalDateTime deliveredAt;
}