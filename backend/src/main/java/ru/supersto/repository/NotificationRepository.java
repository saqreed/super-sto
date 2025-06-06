package ru.supersto.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import ru.supersto.entity.Notification;
import ru.supersto.entity.NotificationType;
import ru.supersto.entity.User;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {

    // Методы с пагинацией
    Page<Notification> findByRecipientOrderByCreatedAtDesc(User recipient, Pageable pageable);

    Page<Notification> findByRecipientAndTypeOrderByCreatedAtDesc(User recipient, NotificationType type,
            Pageable pageable);

    // Методы для списков
    List<Notification> findByRecipientAndIsReadFalseOrderByCreatedAtDesc(User recipient);

    List<Notification> findByRecipientIdOrderByCreatedAtDesc(String recipientId);

    List<Notification> findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(String recipientId);

    // Подсчет
    long countByRecipientAndIsReadFalse(User recipient);

    @Query("{'recipient.id': ?0, 'isRead': false}")
    long countUnreadNotifications(String recipientId);

    // Поиск по типу и ссылкам
    List<Notification> findByRecipientIdAndType(String recipientId, NotificationType type);

    List<Notification> findByReferenceIdAndReferenceType(String referenceId, String referenceType);

    // Поиск по датам
    List<Notification> findByCreatedAtBefore(LocalDateTime date);

    List<Notification> findByExpiresAtBefore(LocalDateTime date);

    @Query("{'createdAt': {'$gte': ?0, '$lte': ?1}}")
    List<Notification> findByDateRange(LocalDateTime startDate, LocalDateTime endDate);

    @Query("{'expiresAt': {'$lt': ?0}}")
    List<Notification> findExpiredNotifications(LocalDateTime now);

    // Удаление истекших уведомлений
    @Query(value = "{'expiresAt': {'$lt': ?0}}", delete = true)
    void deleteExpiredNotifications(LocalDateTime now);

    List<Notification> findByRecipientIdAndCreatedAtAfter(String recipientId, LocalDateTime after);
}