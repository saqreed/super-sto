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
import ru.supersto.dto.ChatMessageDTO;
import ru.supersto.service.ChatService;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Чат", description = "API для системы чата")
@SecurityRequirement(name = "bearerAuth")
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/send")
    @Operation(summary = "Отправить сообщение")
    @PreAuthorize("hasRole('CLIENT') or hasRole('MASTER') or hasRole('ADMIN')")
    public ResponseEntity<ChatMessageDTO> sendMessage(@Valid @RequestBody ChatMessageDTO messageDTO) {
        ChatMessageDTO sentMessage = chatService.sendMessage(messageDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(sentMessage);
    }

    @GetMapping("/conversation/{otherUserId}")
    @Operation(summary = "Получить переписку с пользователем")
    @PreAuthorize("hasRole('CLIENT') or hasRole('MASTER') or hasRole('ADMIN')")
    public ResponseEntity<List<ChatMessageDTO>> getConversation(@PathVariable String otherUserId) {
        List<ChatMessageDTO> conversation = chatService.getConversation(otherUserId);
        return ResponseEntity.ok(conversation);
    }

    @GetMapping("/conversation/{otherUserId}/history")
    @Operation(summary = "Получить историю переписки за период")
    @PreAuthorize("hasRole('CLIENT') or hasRole('MASTER') or hasRole('ADMIN')")
    public ResponseEntity<List<ChatMessageDTO>> getConversationHistory(
            @PathVariable String otherUserId,
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate) {
        List<ChatMessageDTO> history = chatService.getConversationByDateRange(otherUserId, startDate, endDate);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/my-chats")
    @Operation(summary = "Получить все мои чаты")
    @PreAuthorize("hasRole('CLIENT') or hasRole('MASTER') or hasRole('ADMIN')")
    public ResponseEntity<List<ChatMessageDTO>> getMyChats() {
        List<ChatMessageDTO> chats = chatService.getMyChats();
        return ResponseEntity.ok(chats);
    }

    @GetMapping("/unread")
    @Operation(summary = "Получить непрочитанные сообщения")
    @PreAuthorize("hasRole('CLIENT') or hasRole('MASTER') or hasRole('ADMIN')")
    public ResponseEntity<List<ChatMessageDTO>> getUnreadMessages() {
        List<ChatMessageDTO> unreadMessages = chatService.getUnreadMessages();
        return ResponseEntity.ok(unreadMessages);
    }

    @GetMapping("/unread/count")
    @Operation(summary = "Получить количество непрочитанных сообщений")
    @PreAuthorize("hasRole('CLIENT') or hasRole('MASTER') or hasRole('ADMIN')")
    public ResponseEntity<Long> getUnreadCount() {
        long count = chatService.getUnreadCount();
        return ResponseEntity.ok(count);
    }

    @PutMapping("/messages/{messageId}/read")
    @Operation(summary = "Отметить сообщение как прочитанное")
    @PreAuthorize("hasRole('CLIENT') or hasRole('MASTER') or hasRole('ADMIN')")
    public ResponseEntity<ChatMessageDTO> markAsRead(@PathVariable String messageId) {
        ChatMessageDTO message = chatService.markAsRead(messageId);
        return ResponseEntity.ok(message);
    }

    @GetMapping("/appointment/{appointmentId}")
    @Operation(summary = "Получить сообщения по записи")
    @PreAuthorize("hasRole('CLIENT') or hasRole('MASTER') or hasRole('ADMIN')")
    public ResponseEntity<List<ChatMessageDTO>> getAppointmentMessages(@PathVariable String appointmentId) {
        List<ChatMessageDTO> messages = chatService.getAppointmentMessages(appointmentId);
        return ResponseEntity.ok(messages);
    }
} 