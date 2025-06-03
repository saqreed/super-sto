package ru.supersto.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import ru.supersto.entity.ChatMessage;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {

    @Query("{'$or': [{'sender.id': ?0, 'recipient.id': ?1}, {'sender.id': ?1, 'recipient.id': ?0}]}")
    List<ChatMessage> findConversation(String userId1, String userId2);

    @Query("{'$or': [{'sender.id': ?0, 'recipient.id': ?1}, {'sender.id': ?1, 'recipient.id': ?0}], 'createdAt': {'$gte': ?2, '$lte': ?3}}")
    List<ChatMessage> findConversationByDateRange(String userId1, String userId2, LocalDateTime startDate,
            LocalDateTime endDate);

    List<ChatMessage> findBySenderIdOrRecipientIdOrderByCreatedAtDesc(String senderId, String recipientId);

    List<ChatMessage> findByRecipientIdAndIsReadFalse(String recipientId);

    @Query("{'recipient.id': ?0, 'isRead': false}")
    long countUnreadMessages(String userId);

    List<ChatMessage> findByAppointmentId(String appointmentId);

    @Query("{'createdAt': {'$gte': ?0, '$lte': ?1}}")
    List<ChatMessage> findByDateRange(LocalDateTime startDate, LocalDateTime endDate);

    // Последние сообщения для каждого собеседника
    @Query(value = "{'$or': [{'sender.id': ?0}, {'recipient.id': ?0}]}", sort = "{'createdAt': -1}")
    List<ChatMessage> findLastMessagesForUser(String userId);
}