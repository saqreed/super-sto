package ru.supersto.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/health")
@RequiredArgsConstructor
public class HealthController {

    private final MongoTemplate mongoTemplate;

    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();

        try {
            // Проверяем подключение к MongoDB
            mongoTemplate.getDb().getName();
            response.put("status", "UP");
            response.put("database", "Connected");
        } catch (Exception e) {
            response.put("status", "DOWN");
            response.put("database", "Disconnected: " + e.getMessage());
        }

        response.put("timestamp", LocalDateTime.now());
        response.put("application", "СуперСТО Backend");
        response.put("version", "1.0.0");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("pong");
    }
}