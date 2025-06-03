import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chatAPI } from '../../api/chat';

interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  messageType: 'TEXT' | 'IMAGE' | 'FILE';
  appointmentId?: string;
  isRead: boolean;
  sentAt: string;
  senderName?: string;
}

interface Conversation {
  otherUserId: string;
  otherUserName: string;
  lastMessage: ChatMessage;
  unreadCount: number;
}

interface ChatState {
  conversations: Conversation[];
  currentConversation: ChatMessage[];
  activeUserId: string | null;
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  conversations: [],
  currentConversation: [],
  activeUserId: null,
  unreadCount: 0,
  loading: false,
  error: null,
};

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (messageData: {
    receiverId: string;
    content: string;
    messageType?: string;
    appointmentId?: string;
  }) => {
    try {
      return await chatAPI.sendMessage(messageData);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка отправки сообщения');
    }
  }
);

export const fetchConversation = createAsyncThunk(
  'chat/fetchConversation',
  async (otherUserId: string) => {
    try {
      return await chatAPI.getConversation(otherUserId);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка загрузки переписки');
    }
  }
);

export const fetchConversationHistory = createAsyncThunk(
  'chat/fetchConversationHistory',
  async (params: { otherUserId: string; startDate: string; endDate: string }) => {
    try {
      return await chatAPI.getConversationHistory(params);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка загрузки истории переписки');
    }
  }
);

export const fetchMyChats = createAsyncThunk(
  'chat/fetchMyChats',
  async () => {
    try {
      return await chatAPI.getMyChats();
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка загрузки чатов');
    }
  }
);

export const fetchUnreadMessages = createAsyncThunk(
  'chat/fetchUnreadMessages',
  async () => {
    try {
      return await chatAPI.getUnreadMessages();
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка загрузки непрочитанных сообщений');
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'chat/fetchUnreadCount',
  async () => {
    try {
      return await chatAPI.getUnreadCount();
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка получения количества непрочитанных');
    }
  }
);

export const markMessageAsRead = createAsyncThunk(
  'chat/markMessageAsRead',
  async (messageId: string) => {
    try {
      return await chatAPI.markAsRead(messageId);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка отметки сообщения как прочитанное');
    }
  }
);

export const fetchAppointmentMessages = createAsyncThunk(
  'chat/fetchAppointmentMessages',
  async (appointmentId: string) => {
    try {
      return await chatAPI.getAppointmentMessages(appointmentId);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка загрузки сообщений по записи');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveUser: (state, action) => {
      state.activeUserId = action.payload;
    },
    clearCurrentConversation: (state) => {
      state.currentConversation = [];
      state.activeUserId = null;
    },
    addMessageToConversation: (state, action) => {
      state.currentConversation.push(action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
    markConversationAsRead: (state, action) => {
      const userId = action.payload;
      state.currentConversation.forEach(message => {
        if (message.senderId === userId) {
          message.isRead = true;
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.currentConversation.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка отправки сообщения';
      })
      .addCase(fetchConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversation.fulfilled, (state, action) => {
        state.loading = false;
        state.currentConversation = action.payload;
      })
      .addCase(fetchConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки переписки';
      })
      .addCase(fetchConversationHistory.fulfilled, (state, action) => {
        state.currentConversation = action.payload;
      })
      .addCase(fetchMyChats.fulfilled, (state, action) => {
        // Преобразуем сообщения в список бесед
        const conversationsMap = new Map<string, Conversation>();
        
        action.payload.forEach((message: ChatMessage) => {
          const otherUserId = message.senderId === localStorage.getItem('currentUserId') 
            ? message.receiverId 
            : message.senderId;
            
          if (!conversationsMap.has(otherUserId)) {
            conversationsMap.set(otherUserId, {
              otherUserId,
              otherUserName: message.senderName || 'Пользователь',
              lastMessage: message,
              unreadCount: message.isRead ? 0 : 1,
            });
          } else {
            const conversation = conversationsMap.get(otherUserId)!;
            if (new Date(message.sentAt) > new Date(conversation.lastMessage.sentAt)) {
              conversation.lastMessage = message;
            }
            if (!message.isRead) {
              conversation.unreadCount++;
            }
          }
        });
        
        state.conversations = Array.from(conversationsMap.values());
      })
      .addCase(fetchUnreadMessages.fulfilled, (state, action) => {
        // Обновляем счетчик непрочитанных
        state.unreadCount = action.payload.length;
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      .addCase(markMessageAsRead.fulfilled, (state, action) => {
        const message = state.currentConversation.find(m => m.id === action.payload.id);
        if (message) {
          message.isRead = true;
        }
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      })
      .addCase(fetchAppointmentMessages.fulfilled, (state, action) => {
        state.currentConversation = action.payload;
      });
  },
});

export const { 
  setActiveUser, 
  clearCurrentConversation, 
  addMessageToConversation, 
  clearError,
  markConversationAsRead 
} = chatSlice.actions;

export default chatSlice.reducer; 