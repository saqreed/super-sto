package ru.supersto.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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
import ru.supersto.util.Constants;
import ru.supersto.util.ResponseUtils;

@RestController
@RequestMapping(Constants.ApiPaths.API_PREFIX + Constants.ApiPaths.AUTH)
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Аутентификация", description = "API для аутентификации и регистрации пользователей")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Регистрация нового пользователя", description = "Создает нового пользователя в системе")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Регистрация успешна"),
            @ApiResponse(responseCode = "400", description = "Некорректные данные"),
            @ApiResponse(responseCode = "409", description = "Пользователь уже существует")
    })
    public ResponseEntity<ResponseUtils.ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request) {
        log.info("Запрос на регистрацию для email: {}", request.getEmail());
        AuthResponse response = authService.register(request);
        return ResponseUtils.success(response, Constants.Messages.USER_CREATED);
    }

    @PostMapping("/login")
    @Operation(summary = "Вход в систему", description = "Аутентификация пользователя по email и паролю")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Вход выполнен успешно"),
            @ApiResponse(responseCode = "401", description = "Неверные учетные данные"),
            @ApiResponse(responseCode = "400", description = "Некорректные данные")
    })
    public ResponseEntity<ResponseUtils.ApiResponse<AuthResponse>> login(@Valid @RequestBody AuthRequest request) {
        log.info("Запрос на вход для email: {}", request.getEmail());
        AuthResponse response = authService.login(request);
        return ResponseUtils.success(response, Constants.Messages.LOGIN_SUCCESS);
    }

    @PostMapping("/refresh")
    @Operation(summary = "Обновление токена", description = "Обновляет access токен используя refresh токен")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Токен обновлен"),
            @ApiResponse(responseCode = "401", description = "Недействительный refresh токен"),
            @ApiResponse(responseCode = "400", description = "Некорректные данные")
    })
    public ResponseEntity<ResponseUtils.ApiResponse<AuthResponse>> refreshToken(
            @Valid @RequestBody RefreshTokenRequest request) {
        log.info("Запрос на обновление токена");
        AuthResponse response = authService.refreshToken(request.getRefreshToken());
        return ResponseUtils.success(response, "Токен успешно обновлен");
    }

    @PostMapping("/logout")
    @Operation(summary = "Выход из системы", description = "Завершает сессию пользователя")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Выход выполнен успешно")
    })
    public ResponseEntity<ResponseUtils.ApiResponse<String>> logout() {
        // В JWT архитектуре логаут происходит на клиенте путем удаления токенов
        // Здесь можно добавить логику добавления токена в blacklist если нужно
        log.info("Запрос на выход из системы");
        return ResponseUtils.success("logout", Constants.Messages.LOGOUT_SUCCESS);
    }
}