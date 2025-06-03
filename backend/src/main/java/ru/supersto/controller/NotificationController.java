package ru.supersto.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.supersto.dto.NotificationDTO;
import ru.supersto.service.NotificationService;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Уведомления", description = "API для системы уведомлений")
@SecurityRequirement(name = "bearerAuth")
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping
    @Operation(summary = "Создать уведомление")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<NotificationDTO> createNotification(@Valid @RequestBody NotificationDTO notificationDTO) {
        NotificationDTO createdNotification = notificationService.createNotification(notificationDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdNotification);
    }

    @GetMapping("/my")
    @Operation(summary = "Получить мои уведомления")
    @PreAuthorize("hasRole('CLIENT') or hasRole('MASTER') or hasRole('ADMIN')")
    public ResponseEntity<List<NotificationDTO>> getMyNotifications() {
        List<NotificationDTO> notifications = notificationService.getMyNotifications();
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/unread")
    @Operation(summary = "Получить непрочитанные уведомления")
    @PreAuthorize("hasRole('CLIENT') or hasRole('MASTER') or hasRole('ADMIN')")
    public ResponseEntity<List<NotificationDTO>> getUnreadNotifications() {
        List<NotificationDTO> unreadNotifications = notificationService.getUnreadNotifications();
        return ResponseEntity.ok(unreadNotifications);
    }

    @GetMapping("/unread/count")
    @Operation(summary = "Получить количество непрочитанных уведомлений")
    @PreAuthorize("hasRole('CLIENT') or hasRole('MASTER') or hasRole('ADMIN')")
    public ResponseEntity<Long> getUnreadCount() {
        long count = notificationService.getUnreadCount();
        return ResponseEntity.ok(count);
    }

    @PutMapping("/{notificationId}/read")
    @Operation(summary = "Отметить уведомление как прочитанное")
    @PreAuthorize("hasRole('CLIENT') or hasRole('MASTER') or hasRole('ADMIN')")
    public ResponseEntity<NotificationDTO> markAsRead(@PathVariable String notificationId) {
        NotificationDTO notification = notificationService.markAsRead(notificationId);
        return ResponseEntity.ok(notification);
    }

    @PutMapping("/read-all")
    @Operation(summary = "Отметить все уведомления как прочитанные")
    @PreAuthorize("hasRole('CLIENT') or hasRole('MASTER') or hasRole('ADMIN')")
    public ResponseEntity<Void> markAllAsRead() {
        notificationService.markAllAsRead();
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/cleanup")
    @Operation(summary = "Удалить истекшие уведомления")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> cleanupExpiredNotifications() {
        notificationService.cleanupExpiredNotifications();
        return ResponseEntity.ok().build();
    }
}