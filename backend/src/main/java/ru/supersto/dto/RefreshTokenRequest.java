package ru.supersto.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RefreshTokenRequest {

    @NotBlank(message = "Refresh токен не может быть пустым")
    private String refreshToken;
}