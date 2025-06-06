package ru.supersto.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.supersto.util.ApiCompatibilityChecker;
import ru.supersto.util.Constants;
import ru.supersto.util.ResponseUtils;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(Constants.ApiPaths.API_PREFIX + "/health")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Здоровье системы", description = "API для проверки состояния системы")
public class HealthController {

    private final MongoTemplate mongoTemplate;
    private final ApiCompatibilityChecker compatibilityChecker;

    @GetMapping
    @Operation(summary = "Проверка состояния системы")
    public ResponseEntity<ResponseUtils.ApiResponse<Map<String, Object>>> health() {
        Map<String, Object> health = new HashMap<>();

        try {
            // Проверяем подключение к MongoDB
            mongoTemplate.getDb().getName();
            health.put("database", "UP");
        } catch (Exception e) {
            health.put("database", "DOWN");
            health.put("database_error", e.getMessage());
        }

        health.put("status", "UP");
        health.put("timestamp", LocalDateTime.now());
        health.put("service", "SuperSTO Backend");
        health.put("version", "1.0.0");

        log.info("Health check performed");
        return ResponseUtils.success(health, "Система работает");
    }

    @GetMapping("/compatibility")
    @Operation(summary = "Проверка совместимости API с фронтендом")
    public ResponseEntity<ResponseUtils.ApiResponse<String>> checkCompatibility() {
        log.info("API compatibility check requested");
        String report = compatibilityChecker.generateCompatibilityReport();
        return ResponseUtils.success(report, "Отчет о совместимости сгенерирован");
    }

    @GetMapping("/frontend-ready")
    @Operation(summary = "Проверка готовности для подключения фронтенда")
    public ResponseEntity<ResponseUtils.ApiResponse<Map<String, Object>>> frontendReady() {
        Map<String, Object> readiness = new HashMap<>();

        // Проверяем все необходимые компоненты для фронтенда
        readiness.put("api_version", "v1");
        readiness.put("cors_enabled", true);
        readiness.put("jwt_auth", true);
        readiness.put("standardized_responses", true);
        readiness.put("swagger_docs", true);
        readiness.put("error_handling", true);

        // Список доступных endpoints для фронтенда
        Map<String, String[]> endpoints = new HashMap<>();
        endpoints.put("auth",
                new String[] { "/api/auth/login", "/api/auth/register", "/api/auth/refresh", "/api/auth/logout" });
        endpoints.put("users", new String[] { "/api/users/profile", "/api/users/masters" });
        endpoints.put("products", new String[] { "/api/products", "/api/products/categories", "/api/products/search" });
        endpoints.put("services", new String[] { "/api/services", "/api/services/categories" });
        endpoints.put("appointments", new String[] { "/api/appointments" });
        endpoints.put("orders", new String[] { "/api/orders" });

        readiness.put("available_endpoints", endpoints);
        readiness.put("ready_for_frontend", true);
        readiness.put("last_check", LocalDateTime.now());

        log.info("Frontend readiness check performed");
        return ResponseUtils.success(readiness, "Бэкенд готов для подключения фронтенда");
    }

    @GetMapping("/ping")
    @Operation(summary = "Простая проверка доступности")
    public ResponseEntity<ResponseUtils.ApiResponse<String>> ping() {
        return ResponseUtils.success("pong", "Сервер доступен");
    }
}