package ru.supersto.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.supersto.dto.AuthRequest;
import ru.supersto.dto.AuthResponse;
import ru.supersto.dto.RegisterRequest;
import ru.supersto.dto.RefreshTokenRequest;
import ru.supersto.service.AuthService;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Аутентификация", description = "API для аутентификации и регистрации пользователей")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Регистрация нового пользователя", description = "Создает нового пользователя в системе")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Запрос на регистрацию для email: {}", request.getEmail());
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    @Operation(summary = "Вход в систему", description = "Аутентификация пользователя по email и паролю")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        log.info("Запрос на вход для email: {}", request.getEmail());
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    @Operation(summary = "Обновление токена", description = "Обновляет access токен используя refresh токен")
    public ResponseEntity<AuthResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        log.info("Запрос на обновление токена");
        AuthResponse response = authService.refreshToken(request.getRefreshToken());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    @Operation(summary = "Выход из системы", description = "Завершает сессию пользователя")
    public ResponseEntity<String> logout() {
        // В JWT архитектуре логаут происходит на клиенте путем удаления токенов
        // Здесь можно добавить логику добавления токена в blacklist если нужно
        log.info("Запрос на выход из системы");
        return ResponseEntity.ok("Успешно вышли из системы");
    }
}