package ru.supersto.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class OrderItemDTO {

    @NotBlank(message = "ID продукта обязателен")
    private String productId;

    @NotNull(message = "Количество обязательно")
    @Min(value = 1, message = "Количество должно быть больше 0")
    private Integer quantity;

    private BigDecimal unitPrice;
    private BigDecimal totalPrice;

    // Информация о продукте для отображения
    private String productName;
    private String productDescription;
    private String productPartNumber;
    private String productBrand;
}