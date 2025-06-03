package ru.supersto.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ru.supersto.dto.ChatMessageDTO;
import ru.supersto.entity.ChatMessage;
import ru.supersto.entity.User;
import ru.supersto.exception.BusinessException;
import ru.supersto.exception.ResourceNotFoundException;
import ru.supersto.repository.ChatMessageRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final UserService userService;

    public ChatMessageDTO sendMessage(ChatMessageDTO messageDTO) {
        User sender = userService.getCurrentUser();
        User recipient = userService.findById(messageDTO.getRecipientId());

        // Проверяем права: клиенты могут писать только мастерам и наоборот
        validateChatPermissions(sender, recipient);

        ChatMessage message = ChatMessage.builder()
                .sender(sender)
                .recipient(recipient)
                .content(messageDTO.getContent())
                .type(messageDTO.getType())
                .appointmentId(messageDTO.getAppointmentId())
                .build();

        message.prePersist();
        ChatMessage savedMessage = chatMessageRepository.save(message);

        log.info("Сообщение отправлено от {} к {}", sender.getEmail(), recipient.getEmail());

        return mapToDTO(savedMessage);
    }

    public List<ChatMessageDTO> getConversation(String otherUserId) {
        User currentUser = userService.getCurrentUser();
        User otherUser = userService.findById(otherUserId);

        // Проверяем права доступа
        validateChatPermissions(currentUser, otherUser);

        List<ChatMessage> messages = chatMessageRepository.findConversation(
                currentUser.getId(), otherUserId);

        // Отмечаем сообщения как прочитанные
        markMessagesAsRead(messages, currentUser.getId());

        return messages.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ChatMessageDTO> getConversationByDateRange(String otherUserId,
            LocalDateTime startDate,
            LocalDateTime endDate) {
        User currentUser = userService.getCurrentUser();
        User otherUser = userService.findById(otherUserId);

        validateChatPermissions(currentUser, otherUser);

        List<ChatMessage> messages = chatMessageRepository.findConversationByDateRange(
                currentUser.getId(), otherUserId, startDate, endDate);

        return messages.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ChatMessageDTO> getMyChats() {
        User currentUser = userService.getCurrentUser();

        List<ChatMessage> messages = chatMessageRepository.findLastMessagesForUser(
                currentUser.getId());

        return messages.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ChatMessageDTO> getUnreadMessages() {
        User currentUser = userService.getCurrentUser();

        List<ChatMessage> unreadMessages = chatMessageRepository.findByRecipientIdAndIsReadFalse(
                currentUser.getId());

        return unreadMessages.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public long getUnreadCount() {
        User currentUser = userService.getCurrentUser();
        return chatMessageRepository.countUnreadMessages(currentUser.getId());
    }

    public ChatMessageDTO markAsRead(String messageId) {
        ChatMessage message = chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Сообщение не найдено с ID: " + messageId));

        User currentUser = userService.getCurrentUser();

        // Только получатель может отметить сообщение как прочитанное
        if (!message.getRecipient().getId().equals(currentUser.getId())) {
            throw new BusinessException("Вы можете отмечать как прочитанные только свои сообщения");
        }

        message.markAsRead();
        ChatMessage updatedMessage = chatMessageRepository.save(message);

        log.info("Сообщение {} отмечено как прочитанное", messageId);

        return mapToDTO(updatedMessage);
    }

    public List<ChatMessageDTO> getAppointmentMessages(String appointmentId) {
        List<ChatMessage> messages = chatMessageRepository.findByAppointmentId(appointmentId);

        return messages.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private void validateChatPermissions(User user1, User user2) {
        // Клиенты могут общаться только с мастерами и админами
        // Мастера могут общаться с клиентами и админами
        // Админы могут общаться со всеми

        boolean isValidCombination = (user1.getRole().name().equals("CLIENT") &&
                (user2.getRole().name().equals("MASTER") || user2.getRole().name().equals("ADMIN"))) ||
                (user1.getRole().name().equals("MASTER") &&
                        (user2.getRole().name().equals("CLIENT") || user2.getRole().name().equals("ADMIN")))
                ||
                user1.getRole().name().equals("ADMIN") || user2.getRole().name().equals("ADMIN");

        if (!isValidCombination) {
            throw new BusinessException("Недостаточно прав для отправки сообщения этому пользователю");
        }
    }

    private void markMessagesAsRead(List<ChatMessage> messages, String currentUserId) {
        List<ChatMessage> unreadMessages = messages.stream()
                .filter(msg -> msg.getRecipient().getId().equals(currentUserId) && !msg.getIsRead())
                .collect(Collectors.toList());

        for (ChatMessage message : unreadMessages) {
            message.markAsRead();
            chatMessageRepository.save(message);
        }
    }

    private ChatMessageDTO mapToDTO(ChatMessage message) {
        return ChatMessageDTO.builder()
                .id(message.getId())
                .senderId(message.getSender().getId())
                .senderName(message.getSender().getFirstName() + " " + message.getSender().getLastName())
                .senderEmail(message.getSender().getEmail())
                .recipientId(message.getRecipient().getId())
                .recipientName(message.getRecipient().getFirstName() + " " + message.getRecipient().getLastName())
                .recipientEmail(message.getRecipient().getEmail())
                .content(message.getContent())
                .type(message.getType())
                .appointmentId(message.getAppointmentId())
                .isRead(message.getIsRead())
                .createdAt(message.getCreatedAt())
                .readAt(message.getReadAt())
                .build();
    }
}