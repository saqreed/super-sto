package ru.supersto.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import ru.supersto.entity.Notification;
import ru.supersto.entity.NotificationType;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {

    List<Notification> findByRecipientIdOrderByCreatedAtDesc(String recipientId);

    List<Notification> findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(String recipientId);

    @Query("{'recipient.id': ?0, 'isRead': false}")
    long countUnreadNotifications(String recipientId);

    List<Notification> findByRecipientIdAndType(String recipientId, NotificationType type);

    List<Notification> findByReferenceIdAndReferenceType(String referenceId, String referenceType);

    @Query("{'createdAt': {'$gte': ?0, '$lte': ?1}}")
    List<Notification> findByDateRange(LocalDateTime startDate, LocalDateTime endDate);

    @Query("{'expiresAt': {'$lt': ?0}}")
    List<Notification> findExpiredNotifications(LocalDateTime now);

    // Удаление истекших уведомлений
    @Query(value = "{'expiresAt': {'$lt': ?0}}", delete = true)
    void deleteExpiredNotifications(LocalDateTime now);

    List<Notification> findByRecipientIdAndCreatedAtAfter(String recipientId, LocalDateTime after);
}