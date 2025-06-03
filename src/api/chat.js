import { apiClient } from './client';

export const chatAPI = {
  // Отправить сообщение
  sendMessage: async (messageData) => {
    const response = await apiClient.post('/chat/send', messageData);
    return response.data;
  },

  // Получить переписку с пользователем
  getConversation: async (userId, params) => {
    const response = await apiClient.get(`/chat/conversation/${userId}`, { params });
    return response.data;
  },

  // Получить историю переписки за период
  getConversationHistory: async (params) => {
    const { otherUserId, startDate, endDate } = params;
    const response = await apiClient.get(`/chat/conversation/${otherUserId}/history`, {
      params: { startDate, endDate }
    });
    return response.data;
  },

  // Получить все мои чаты
  getMyChats: async () => {
    const response = await apiClient.get('/chat/my-chats');
    return response.data;
  },

  // Получить непрочитанные сообщения
  getUnreadMessages: async () => {
    const response = await apiClient.get('/chat/unread');
    return response.data;
  },

  // Получить список всех переписок
  getConversations: async () => {
    const response = await apiClient.get('/chat/conversations');
    return response.data;
  },

  // Получить количество непрочитанных сообщений
  getUnreadCount: async () => {
    const response = await apiClient.get('/chat/unread/count');
    return response.data;
  },

  // Отметить сообщение как прочитанное
  markAsRead: async (messageId) => {
    const response = await apiClient.put(`/chat/messages/${messageId}/read`);
    return response.data;
  },

  // Получить сообщения по записи
  getAppointmentMessages: async (appointmentId) => {
    const response = await apiClient.get(`/chat/appointment/${appointmentId}`);
    return response.data;
  },

  // Получить сообщения по записи (legacy)
  getMessagesByAppointment: async (appointmentId) => {
    const response = await apiClient.get(`/chat/appointment/${appointmentId}`);
    return response.data;
  },

  // Загрузить файл в чат
  uploadFile: async (file, conversationId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('conversationId', conversationId);
    
    const response = await apiClient.post('/chat/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Удалить сообщение
  deleteMessage: async (messageId) => {
    await apiClient.delete(`/chat/message/${messageId}`);
  },
};

export default chatAPI; 