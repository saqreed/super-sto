package ru.supersto.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Builder;
import lombok.Data;
import ru.supersto.entity.ServiceCategory;

import java.math.BigDecimal;

@Data
@Builder
public class ServiceDTO {

    private String id;

    @NotBlank(message = "Название услуги не может быть пустым")
    private String name;

    private String description;

    @NotNull(message = "Цена услуги обязательна")
    @Positive(message = "Цена должна быть положительной")
    private BigDecimal price;

    private Integer duration; // в минутах

    @NotNull(message = "Категория услуги обязательна")
    private ServiceCategory category;

    private Boolean isActive;
}