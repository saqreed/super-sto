package ru.supersto.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import ru.supersto.dto.ChatMessageDTO;
import ru.supersto.entity.ChatMessage;
import ru.supersto.entity.ChatMessageType;
import ru.supersto.entity.User;
import ru.supersto.entity.UserRole;
import ru.supersto.exception.BusinessException;
import ru.supersto.exception.ResourceNotFoundException;
import ru.supersto.repository.ChatMessageRepository;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChatServiceTest {

    @Mock
    private ChatMessageRepository chatMessageRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private ChatService chatService;

    private User clientUser;
    private User masterUser;
    private ChatMessage testMessage;
    private ChatMessageDTO testMessageDTO;

    @BeforeEach
    void setUp() {
        clientUser = User.builder()
                .id("client-id")
                .email("client@example.com")
                .firstName("Клиент")
                .lastName("Тестовый")
                .role(UserRole.CLIENT)
                .build();

        masterUser = User.builder()
                .id("master-id")
                .email("master@example.com")
                .firstName("Мастер")
                .lastName("Тестовый")
                .role(UserRole.MASTER)
                .build();

        testMessage = ChatMessage.builder()
                .id("message-id")
                .sender(clientUser)
                .recipient(masterUser)
                .content("Тестовое сообщение")
                .type(ChatMessageType.TEXT)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();

        testMessageDTO = ChatMessageDTO.builder()
                .recipientId("master-id")
                .content("Тестовое сообщение")
                .type(ChatMessageType.TEXT)
                .build();
    }

    @Test
    void sendMessage_ValidMessage_ReturnsMessageDTO() {
        // Arrange
        when(userService.getCurrentUser()).thenReturn(clientUser);
        when(userService.findById("master-id")).thenReturn(masterUser);
        when(chatMessageRepository.save(any(ChatMessage.class))).thenReturn(testMessage);

        // Act
        ChatMessageDTO result = chatService.sendMessage(testMessageDTO);

        // Assert
        assertNotNull(result);
        assertEquals("Тестовое сообщение", result.getContent());
        verify(userService).getCurrentUser();
        verify(userService).findById("master-id");
        verify(chatMessageRepository).save(any(ChatMessage.class));
    }

    @Test
    void sendMessage_InvalidPermissions_ThrowsException() {
        // Arrange
        User anotherClient = User.builder()
                .id("client2-id")
                .role(UserRole.CLIENT)
                .build();

        when(userService.getCurrentUser()).thenReturn(clientUser);
        when(userService.findById("client2-id")).thenReturn(anotherClient);

        testMessageDTO.setRecipientId("client2-id");

        // Act & Assert
        assertThrows(BusinessException.class, () -> chatService.sendMessage(testMessageDTO));
        verify(userService).getCurrentUser();
        verify(userService).findById("client2-id");
        verify(chatMessageRepository, never()).save(any(ChatMessage.class));
    }

    @Test
    void getConversation_ValidUsers_ReturnsMessages() {
        // Arrange
        List<ChatMessage> messages = Arrays.asList(testMessage);
        when(userService.getCurrentUser()).thenReturn(clientUser);
        when(userService.findById("master-id")).thenReturn(masterUser);
        when(chatMessageRepository.findConversation("client-id", "master-id")).thenReturn(messages);

        // Act
        List<ChatMessageDTO> result = chatService.getConversation("master-id");

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Тестовое сообщение", result.get(0).getContent());
        verify(userService).getCurrentUser();
        verify(userService).findById("master-id");
        verify(chatMessageRepository).findConversation("client-id", "master-id");
    }

    @Test
    void getUnreadMessages_ReturnsUnreadMessages() {
        // Arrange
        List<ChatMessage> unreadMessages = Arrays.asList(testMessage);
        when(userService.getCurrentUser()).thenReturn(masterUser);
        when(chatMessageRepository.findByRecipientIdAndIsReadFalse("master-id")).thenReturn(unreadMessages);

        // Act
        List<ChatMessageDTO> result = chatService.getUnreadMessages();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertFalse(result.get(0).getIsRead());
        verify(userService).getCurrentUser();
        verify(chatMessageRepository).findByRecipientIdAndIsReadFalse("master-id");
    }

    @Test
    void getUnreadCount_ReturnsCount() {
        // Arrange
        when(userService.getCurrentUser()).thenReturn(masterUser);
        when(chatMessageRepository.countUnreadMessages("master-id")).thenReturn(5L);

        // Act
        long result = chatService.getUnreadCount();

        // Assert
        assertEquals(5L, result);
        verify(userService).getCurrentUser();
        verify(chatMessageRepository).countUnreadMessages("master-id");
    }

    @Test
    void markAsRead_ValidMessage_MarksAsRead() {
        // Arrange
        when(chatMessageRepository.findById("message-id")).thenReturn(Optional.of(testMessage));
        when(userService.getCurrentUser()).thenReturn(masterUser);
        when(chatMessageRepository.save(any(ChatMessage.class))).thenReturn(testMessage);

        // Act
        ChatMessageDTO result = chatService.markAsRead("message-id");

        // Assert
        assertNotNull(result);
        verify(chatMessageRepository).findById("message-id");
        verify(userService).getCurrentUser();
        verify(chatMessageRepository).save(any(ChatMessage.class));
    }

    @Test
    void markAsRead_NonExistingMessage_ThrowsException() {
        // Arrange
        when(chatMessageRepository.findById("non-existing-id")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class,
                () -> chatService.markAsRead("non-existing-id"));
        verify(chatMessageRepository).findById("non-existing-id");
    }

    @Test
    void markAsRead_NotRecipient_ThrowsException() {
        // Arrange
        when(chatMessageRepository.findById("message-id")).thenReturn(Optional.of(testMessage));
        when(userService.getCurrentUser()).thenReturn(clientUser);

        // Act & Assert
        assertThrows(BusinessException.class, () -> chatService.markAsRead("message-id"));
        verify(chatMessageRepository).findById("message-id");
        verify(userService).getCurrentUser();
        verify(chatMessageRepository, never()).save(any(ChatMessage.class));
    }
}