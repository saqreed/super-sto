package ru.supersto.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.supersto.dto.NotificationDTO;
import ru.supersto.entity.Notification;
import ru.supersto.entity.User;
import ru.supersto.service.NotificationService;
import ru.supersto.service.UserService;
import ru.supersto.util.Constants;
import ru.supersto.util.ResponseUtils;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(Constants.ApiPaths.API_PREFIX + "/notifications")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Уведомления", description = "API для системы уведомлений")
@SecurityRequirement(name = "Bearer Authentication")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;

    @GetMapping
    @Operation(summary = "Получить мои уведомления с пагинацией")
    @PreAuthorize("hasRole('CLIENT') or hasRole('MASTER') or hasRole('ADMIN')")
    public ResponseEntity<ResponseUtils.PaginatedResponse<NotificationDTO>> getMyNotifications(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        User currentUser = userService.getCurrentUser();
        Pageable pageable = ResponseUtils.createPageable(page, size, sortBy, sortDir);
        Page<Notification> notifications = notificationService.getUserNotifications(currentUser, pageable);

        Page<NotificationDTO> notificationDTOs = notifications.map(this::mapToDTO);
        return ResponseUtils.paginated(notificationDTOs);
    }

    @GetMapping("/unread")
    @Operation(summary = "Получить непрочитанные уведомления")
    @PreAuthorize("hasRole('CLIENT') or hasRole('MASTER') or hasRole('ADMIN')")
    public ResponseEntity<ResponseUtils.ApiResponse<List<NotificationDTO>>> getUnreadNotifications() {
        User currentUser = userService.getCurrentUser();
        List<Notification> unreadNotifications = notificationService.getUnreadNotifications(currentUser);
        List<NotificationDTO> notificationDTOs = unreadNotifications.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseUtils.success(notificationDTOs);
    }

    @GetMapping("/unread/count")
    @Operation(summary = "Получить количество непрочитанных уведомлений")
    @PreAuthorize("hasRole('CLIENT') or hasRole('MASTER') or hasRole('ADMIN')")
    public ResponseEntity<ResponseUtils.ApiResponse<Long>> getUnreadCount() {
        User currentUser = userService.getCurrentUser();
        long count = notificationService.getUnreadCount(currentUser);
        return ResponseUtils.success(count);
    }

    @PutMapping("/{notificationId}/read")
    @Operation(summary = "Отметить уведомление как прочитанное")
    @PreAuthorize("hasRole('CLIENT') or hasRole('MASTER') or hasRole('ADMIN')")
    public ResponseEntity<ResponseUtils.ApiResponse<NotificationDTO>> markAsRead(@PathVariable String notificationId) {
        User currentUser = userService.getCurrentUser();
        Notification notification = notificationService.markAsRead(notificationId, currentUser);
        return ResponseUtils.success(mapToDTO(notification), "Уведомление отмечено как прочитанное");
    }

    @PutMapping("/read-all")
    @Operation(summary = "Отметить все уведомления как прочитанные")
    @PreAuthorize("hasRole('CLIENT') or hasRole('MASTER') or hasRole('ADMIN')")
    public ResponseEntity<ResponseUtils.ApiResponse<String>> markAllAsRead() {
        User currentUser = userService.getCurrentUser();
        notificationService.markAllAsRead(currentUser);
        return ResponseUtils.success("success", "Все уведомления отмечены как прочитанные");
    }

    @DeleteMapping("/cleanup")
    @Operation(summary = "Удалить истекшие уведомления")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseUtils.ApiResponse<String>> cleanupExpiredNotifications() {
        notificationService.cleanupExpiredNotifications();
        return ResponseUtils.success("cleanup", "Истекшие уведомления удалены");
    }

    private NotificationDTO mapToDTO(Notification notification) {
        return NotificationDTO.builder()
                .id(notification.getId())
                .recipientId(notification.getRecipient().getId())
                .type(notification.getType())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .readAt(notification.getReadAt())
                .referenceId(notification.getReferenceId())
                .referenceType(notification.getReferenceType())
                .build();
    }
}