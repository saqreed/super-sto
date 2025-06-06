import client from './client';
import type { ChatMessage, SendMessageRequest } from '../types';

export const chatAPI = {
  // Отправить сообщение
  sendMessage: (message: SendMessageRequest) => client.post('/chat/messages', message),
  
  // Получить переписку с пользователем
  getConversation: (userId: string): Promise<{ data: ChatMessage[] }> =>
    client.get(`/chat/conversation/${userId}`),
  
  // Получить все мои переписки
  getConversations: () => client.get('/chat/conversations'),
  
  // Количество непрочитанных сообщений
  getUnreadCount: (): Promise<{ data: number }> =>
    client.get('/chat/unread/count'),
  
  // Отметить сообщения как прочитанные
  markAsRead: (messageId: string) => client.put(`/chat/messages/${messageId}/read`),
  
  // Получить сообщения из переписки
  getMessages: (conversationId: string) => client.get(`/chat/conversation/${conversationId}/history`),
  
  // Удалить сообщение
  deleteMessage: (messageId: string) => client.delete(`/chat/messages/${messageId}`),
}; 
