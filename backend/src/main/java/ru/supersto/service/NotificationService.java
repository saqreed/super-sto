package ru.supersto.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import ru.supersto.entity.Notification;
import ru.supersto.entity.NotificationType;
import ru.supersto.entity.User;
import ru.supersto.repository.NotificationRepository;
import ru.supersto.util.Constants;
import ru.supersto.util.DateUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CompletableFuture;

/**
 * Сервис для работы с уведомлениями
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService extends BaseService<Notification, String> {

    private final NotificationRepository notificationRepository;

    @Override
    protected NotificationRepository getRepository() {
        return notificationRepository;
    }

    @Override
    protected String getEntityName() {
        return "Уведомление";
    }

    /**
     * Создать уведомление
     */
    @Async("notificationExecutor")
    public CompletableFuture<Notification> createNotification(
            User user, 
            NotificationType type, 
            String title, 
            String message) {
        
        log.info("Создание уведомления для пользователя {}: {}", user.getEmail(), title);
        
        Notification notification = Notification.builder()
            .recipient(user)
            .type(type)
            .title(title)
            .message(message)
            .isRead(false)
            .createdAt(DateUtils.nowInMoscow())
            .build();
        
        notification.prePersist();
        Notification saved = save(notification);
        
        // Здесь можно добавить отправку push-уведомлений, email и т.д.
        sendPushNotification(saved);
        
        return CompletableFuture.completedFuture(saved);
    }

    /**
     * Получить уведомления пользователя
     */
    public Page<Notification> getUserNotifications(User user, Pageable pageable) {
        log.debug("Получение уведомлений для пользователя: {}", user.getEmail());
        return notificationRepository.findByRecipientOrderByCreatedAtDesc(user, pageable);
    }

    /**
     * Получить непрочитанные уведомления пользователя
     */
    public List<Notification> getUnreadNotifications(User user) {
        log.debug("Получение непрочитанных уведомлений для пользователя: {}", user.getEmail());
        return notificationRepository.findByRecipientAndIsReadFalseOrderByCreatedAtDesc(user);
    }

    /**
     * Получить количество непрочитанных уведомлений
     */
    public long getUnreadCount(User user) {
        log.debug("Подсчет непрочитанных уведомлений для пользователя: {}", user.getEmail());
        return notificationRepository.countByRecipientAndIsReadFalse(user);
    }

    /**
     * Отметить уведомление как прочитанное
     */
    public Notification markAsRead(String notificationId, User user) {
        log.info("Отметка уведомления {} как прочитанного для пользователя {}", 
            notificationId, user.getEmail());
        
        Notification notification = findByIdOrThrow(notificationId);
        
        // Проверяем, что уведомление принадлежит пользователю
        if (!notification.getRecipient().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Уведомление не принадлежит пользователю");
        }
        
        notification.markAsRead();
        
        return update(notification);
    }

    /**
     * Отметить все уведомления как прочитанные
     */
    public void markAllAsRead(User user) {
        log.info("Отметка всех уведомлений как прочитанных для пользователя: {}", user.getEmail());
        
        List<Notification> unreadNotifications = getUnreadNotifications(user);
        
        unreadNotifications.forEach(Notification::markAsRead);
        
        notificationRepository.saveAll(unreadNotifications);
        log.info("Отмечено {} уведомлений как прочитанных", unreadNotifications.size());
    }

    /**
     * Удалить старые уведомления
     */
    public void deleteOldNotifications() {
        log.info("Удаление старых уведомлений");
        
        LocalDateTime cutoffDate = DateUtils.nowInMoscow()
            .minusDays(Constants.Limits.MAX_NOTIFICATION_AGE_DAYS);
        
        List<Notification> oldNotifications = notificationRepository
            .findByCreatedAtBefore(cutoffDate);
        
        if (!oldNotifications.isEmpty()) {
            notificationRepository.deleteAll(oldNotifications);
            log.info("Удалено {} старых уведомлений", oldNotifications.size());
        }
    }

    /**
     * Создать уведомление о новой записи
     */
    public CompletableFuture<Notification> createAppointmentNotification(
            User user, 
            String appointmentId, 
            String serviceName, 
            LocalDateTime appointmentTime) {
        
        String title = "Новая запись на услугу";
        String message = String.format(
            "Вы записались на услугу '%s' на %s", 
            serviceName, 
            DateUtils.formatDateTime(appointmentTime)
        );
        
        return createNotificationWithReference(user, NotificationType.INFO, title, message, 
            appointmentId, "APPOINTMENT");
    }

    /**
     * Создать уведомление об изменении статуса записи
     */
    public CompletableFuture<Notification> createAppointmentStatusNotification(
            User user, 
            String appointmentId, 
            String status) {
        
        String title = "Изменение статуса записи";
        String message = String.format("Статус вашей записи изменен на: %s", status);
        
        return createNotificationWithReference(user, NotificationType.INFO, title, message, 
            appointmentId, "APPOINTMENT");
    }

    /**
     * Создать уведомление о новом заказе
     */
    public CompletableFuture<Notification> createOrderNotification(
            User user, 
            String orderId, 
            double totalAmount) {
        
        String title = "Новый заказ";
        String message = String.format(
            "Ваш заказ №%s на сумму %.2f руб. принят в обработку", 
            orderId, 
            totalAmount
        );
        
        return createNotificationWithReference(user, NotificationType.SUCCESS, title, message, 
            orderId, "ORDER");
    }

    /**
     * Создать уведомление об изменении статуса заказа
     */
    public CompletableFuture<Notification> createOrderStatusNotification(
            User user, 
            String orderId, 
            String status) {
        
        String title = "Изменение статуса заказа";
        String message = String.format("Статус заказа №%s изменен на: %s", orderId, status);
        
        return createNotificationWithReference(user, NotificationType.INFO, title, message, 
            orderId, "ORDER");
    }

    /**
     * Создать системное уведомление
     */
    public CompletableFuture<Notification> createSystemNotification(
            User user, 
            String title, 
            String message) {
        
        return createNotificationWithReference(user, NotificationType.INFO, title, message, 
            null, "SYSTEM");
    }

    /**
     * Создать уведомление с ссылкой
     */
    @Async("notificationExecutor")
    public CompletableFuture<Notification> createNotificationWithReference(
            User user, 
            NotificationType type, 
            String title, 
            String message,
            String referenceId,
            String referenceType) {
        
        log.info("Создание уведомления с ссылкой для пользователя {}: {}", user.getEmail(), title);
        
        Notification notification = Notification.builder()
            .recipient(user)
            .type(type)
            .title(title)
            .message(message)
            .referenceId(referenceId)
            .referenceType(referenceType)
            .isRead(false)
            .createdAt(DateUtils.nowInMoscow())
            .build();
        
        notification.prePersist();
        Notification saved = save(notification);
        
        sendPushNotification(saved);
        
        return CompletableFuture.completedFuture(saved);
    }

    /**
     * Отправить push-уведомление (заглушка)
     */
    @Async("notificationExecutor")
    private void sendPushNotification(Notification notification) {
        // TODO: Реализовать отправку push-уведомлений
        log.debug("Push-уведомление отправлено: {}", notification.getTitle());
    }

    /**
     * Получить уведомления по типу
     */
    public Page<Notification> getNotificationsByType(
            User user, 
            NotificationType type, 
            Pageable pageable) {
        
        log.debug("Получение уведомлений типа {} для пользователя: {}", type, user.getEmail());
        return notificationRepository.findByRecipientAndTypeOrderByCreatedAtDesc(user, type, pageable);
    }

    /**
     * Удалить уведомление
     */
    public void deleteNotification(String notificationId, User user) {
        log.info("Удаление уведомления {} пользователем {}", notificationId, user.getEmail());
        
        Notification notification = findByIdOrThrow(notificationId);
        
        // Проверяем, что уведомление принадлежит пользователю
        if (!notification.getRecipient().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Уведомление не принадлежит пользователю");
        }
        
        delete(notification);
    }

    /**
     * Очистить истекшие уведомления
     */
    public void cleanupExpiredNotifications() {
        log.info("Очистка истекших уведомлений");
        
        LocalDateTime now = DateUtils.nowInMoscow();
        List<Notification> expiredNotifications = notificationRepository.findByExpiresAtBefore(now);
        
        if (!expiredNotifications.isEmpty()) {
            notificationRepository.deleteAll(expiredNotifications);
            log.info("Удалено {} истекших уведомлений", expiredNotifications.size());
        }
    }
} 