package ru.supersto.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Builder;
import lombok.Data;
import ru.supersto.entity.ProductCategory;

import java.math.BigDecimal;

@Data
@Builder
public class ProductDTO {

    private String id;

    @NotBlank(message = "Название продукта не может быть пустым")
    private String name;

    private String description;

    @NotNull(message = "Цена продукта обязательна")
    @Positive(message = "Цена должна быть положительной")
    private BigDecimal price;

    @NotNull(message = "Количество обязательно")
    @Min(value = 0, message = "Количество не может быть отрицательным")
    private Integer quantity;

    @NotNull(message = "Категория продукта обязательна")
    private ProductCategory category;

    private String brand;

    @NotBlank(message = "Артикул продукта обязателен")
    private String partNumber;

    private Boolean isActive;

    // Дополнительные поля для отображения
    private boolean inStock;
    private boolean lowStock;
}