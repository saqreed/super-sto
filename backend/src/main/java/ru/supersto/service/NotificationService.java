package ru.supersto.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ru.supersto.dto.NotificationDTO;
import ru.supersto.entity.*;
import ru.supersto.exception.ResourceNotFoundException;
import ru.supersto.repository.NotificationRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserService userService;

    public NotificationDTO createNotification(NotificationDTO notificationDTO) {
        User recipient = userService.findById(notificationDTO.getRecipientId());

        Notification notification = Notification.builder()
                .recipient(recipient)
                .title(notificationDTO.getTitle())
                .message(notificationDTO.getMessage())
                .type(notificationDTO.getType())
                .referenceId(notificationDTO.getReferenceId())
                .referenceType(notificationDTO.getReferenceType())
                .actionUrl(notificationDTO.getActionUrl())
                .build();

        notification.prePersist();
        Notification savedNotification = notificationRepository.save(notification);

        log.info("Создано уведомление для пользователя {}: {}", recipient.getEmail(), notificationDTO.getTitle());

        return mapToDTO(savedNotification);
    }

    public List<NotificationDTO> getMyNotifications() {
        User currentUser = userService.getCurrentUser();

        List<Notification> notifications = notificationRepository.findByRecipientIdOrderByCreatedAtDesc(
                currentUser.getId());

        return notifications.stream()
                .filter(n -> !n.isExpired())
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<NotificationDTO> getUnreadNotifications() {
        User currentUser = userService.getCurrentUser();

        List<Notification> notifications = notificationRepository.findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(
                currentUser.getId());

        return notifications.stream()
                .filter(n -> !n.isExpired())
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public long getUnreadCount() {
        User currentUser = userService.getCurrentUser();
        return notificationRepository.countUnreadNotifications(currentUser.getId());
    }

    public NotificationDTO markAsRead(String notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Уведомление не найдено с ID: " + notificationId));

        User currentUser = userService.getCurrentUser();

        // Только получатель может отметить уведомление как прочитанное
        if (!notification.getRecipient().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Вы можете отмечать как прочитанные только свои уведомления");
        }

        notification.markAsRead();
        Notification updatedNotification = notificationRepository.save(notification);

        log.info("Уведомление {} отмечено как прочитанное", notificationId);

        return mapToDTO(updatedNotification);
    }

    public void markAllAsRead() {
        User currentUser = userService.getCurrentUser();

        List<Notification> unreadNotifications = notificationRepository
                .findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(
                        currentUser.getId());

        for (Notification notification : unreadNotifications) {
            notification.markAsRead();
            notificationRepository.save(notification);
        }

        log.info("Все уведомления пользователя {} отмечены как прочитанные", currentUser.getEmail());
    }

    public void cleanupExpiredNotifications() {
        notificationRepository.deleteExpiredNotifications(LocalDateTime.now());
        log.info("Удалены истекшие уведомления");
    }

    // Методы для создания типовых уведомлений

    public void notifyAppointmentStatusChange(Appointment appointment) {
        String title = "Изменение статуса записи";
        String message = String.format("Статус вашей записи на %s изменен на: %s",
                appointment.getService().getName(),
                getStatusText(appointment.getStatus()));

        NotificationDTO notification = NotificationDTO.builder()
                .recipientId(appointment.getClient().getId())
                .title(title)
                .message(message)
                .type(NotificationType.INFO)
                .referenceId(appointment.getId())
                .referenceType("APPOINTMENT")
                .actionUrl("/appointments/" + appointment.getId())
                .build();

        createNotification(notification);

        // Эмуляция email (логирование)
        simulateEmailNotification(appointment.getClient().getEmail(), title, message);
    }

    public void notifyOrderStatusChange(Order order) {
        String title = "Изменение статуса заказа";
        String message = String.format("Статус вашего заказа #%s изменен на: %s",
                order.getId().substring(0, 8),
                getOrderStatusText(order.getStatus()));

        NotificationDTO notification = NotificationDTO.builder()
                .recipientId(order.getClient().getId())
                .title(title)
                .message(message)
                .type(NotificationType.INFO)
                .referenceId(order.getId())
                .referenceType("ORDER")
                .actionUrl("/orders/" + order.getId())
                .build();

        createNotification(notification);

        // Эмуляция email
        simulateEmailNotification(order.getClient().getEmail(), title, message);
    }

    public void notifyNewReview(Review review) {
        if (review.getMaster() != null) {
            String title = "Новый отзыв";
            String message = String.format("Вы получили новый отзыв с оценкой %d звезд за услугу '%s'",
                    review.getRating(),
                    review.getService().getName());

            NotificationDTO notification = NotificationDTO.builder()
                    .recipientId(review.getMaster().getId())
                    .title(title)
                    .message(message)
                    .type(NotificationType.SUCCESS)
                    .referenceId(review.getId())
                    .referenceType("REVIEW")
                    .actionUrl("/reviews/" + review.getId())
                    .build();

            createNotification(notification);
        }
    }

    public void notifyLowStock(Product product) {
        // Уведомление для всех админов о низком остатке
        List<User> admins = userService.findByRole(UserRole.ADMIN);

        for (User admin : admins) {
            String title = "Низкий остаток товара";
            String message = String.format("Товар '%s' (арт. %s) заканчивается. Остаток: %d шт.",
                    product.getName(),
                    product.getPartNumber(),
                    product.getQuantity());

            NotificationDTO notification = NotificationDTO.builder()
                    .recipientId(admin.getId())
                    .title(title)
                    .message(message)
                    .type(NotificationType.WARNING)
                    .referenceId(product.getId())
                    .referenceType("PRODUCT")
                    .actionUrl("/products/" + product.getId())
                    .build();

            createNotification(notification);
        }
    }

    private void simulateEmailNotification(String email, String title, String message) {
        // Эмуляция отправки email через логи (для пет проекта)
        log.info("📧 EMAIL SIMULATION 📧");
        log.info("To: {}", email);
        log.info("Subject: {}", title);
        log.info("Body: {}", message);
        log.info("========================");
    }

    private String getStatusText(AppointmentStatus status) {
        return switch (status) {
            case PENDING -> "Ожидает подтверждения";
            case CONFIRMED -> "Подтверждена";
            case IN_PROGRESS -> "В процессе";
            case COMPLETED -> "Завершена";
            case CANCELLED -> "Отменена";
            default -> "Неизвестно";
        };
    }

    private String getOrderStatusText(OrderStatus status) {
        return switch (status) {
            case PENDING -> "Ожидает обработки";
            case CONFIRMED -> "Подтверждён";
            case SHIPPED -> "Отправлен";
            case DELIVERED -> "Доставлен";
            case CANCELLED -> "Отменён";
            default -> "Неизвестно";
        };
    }

    private NotificationDTO mapToDTO(Notification notification) {
        return NotificationDTO.builder()
                .id(notification.getId())
                .recipientId(notification.getRecipient().getId())
                .recipientName(
                        notification.getRecipient().getFirstName() + " " + notification.getRecipient().getLastName())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType())
                .referenceId(notification.getReferenceId())
                .referenceType(notification.getReferenceType())
                .isRead(notification.getIsRead())
                .actionUrl(notification.getActionUrl())
                .createdAt(notification.getCreatedAt())
                .readAt(notification.getReadAt())
                .expiresAt(notification.getExpiresAt())
                .build();
    }
}