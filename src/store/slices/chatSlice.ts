import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Chat, Message, MessageAttachment } from '../../types';

interface ChatState {
  chats: Chat[];
  messages: { [chatId: string]: Message[] };
  activeChat: string | null;
  loading: boolean;
  error: string | null;
  unreadCount: number;
}

const initialState: ChatState = {
  chats: [],
  messages: {},
  activeChat: null,
  loading: false,
  error: null,
  unreadCount: 0,
};

// Mock data for development
const mockChats: Chat[] = [
  {
    id: '1',
    requestId: '1',
    participants: [
      {
        userId: '1',
        userName: 'Иван Петров',
        userRole: 'client' as any,
        joinedAt: new Date('2024-01-10T09:00:00'),
        lastReadAt: new Date('2024-01-15T14:30:00'),
      },
      {
        userId: '2',
        userName: 'Алексей Мастеров',
        userRole: 'master' as any,
        joinedAt: new Date('2024-01-10T09:00:00'),
        lastReadAt: new Date('2024-01-15T15:00:00'),
      },
    ],
    lastMessage: {
      id: '3',
      requestId: '1',
      senderId: '2',
      senderName: 'Алексей Мастеров',
      senderRole: 'master' as any,
      content: 'Работа завершена. Все детали заменены согласно плану.',
      createdAt: new Date('2024-01-15T15:00:00'),
      read: true,
    },
    unreadCount: 0,
    createdAt: new Date('2024-01-10T09:00:00'),
    updatedAt: new Date('2024-01-15T15:00:00'),
  },
];

const mockMessages: { [chatId: string]: Message[] } = {
  '1': [
    {
      id: '1',
      requestId: '1',
      senderId: '1',
      senderName: 'Иван Петров',
      senderRole: 'client' as any,
      content: 'Здравствуйте! Когда можно будет приступить к ремонту?',
      createdAt: new Date('2024-01-10T09:00:00'),
      read: true,
    },
    {
      id: '2',
      requestId: '1',
      senderId: '2',
      senderName: 'Алексей Мастеров',
      senderRole: 'master' as any,
      content: 'Добрый день! Приступаю к диагностике сегодня. Результаты будут готовы к вечеру.',
      createdAt: new Date('2024-01-10T10:30:00'),
      read: true,
    },
    {
      id: '3',
      requestId: '1',
      senderId: '2',
      senderName: 'Алексей Мастеров',
      senderRole: 'master' as any,
      content: 'Работа завершена. Все детали заменены согласно плану.',
      attachments: [
        {
          id: '1',
          name: 'result_photo.jpg',
          url: '/uploads/result_photo.jpg',
          type: 'image',
          size: 1024000,
        },
      ],
      createdAt: new Date('2024-01-15T15:00:00'),
      read: true,
    },
  ],
};

export const fetchChats = createAsyncThunk(
  'chat/fetchChats',
  async (userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      chats: mockChats.filter(chat => 
        chat.participants.some(p => p.userId === userId)
      ),
      messages: mockMessages,
    };
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (messageData: {
    chatId: string;
    requestId: string;
    senderId: string;
    senderName: string;
    senderRole: string;
    content: string;
    attachments?: MessageAttachment[];
  }) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newMessage: Message = {
      id: Date.now().toString(),
      requestId: messageData.requestId,
      senderId: messageData.senderId,
      senderName: messageData.senderName,
      senderRole: messageData.senderRole as any,
      content: messageData.content,
      attachments: messageData.attachments,
      createdAt: new Date(),
      read: false,
    };
    
    return { chatId: messageData.chatId, message: newMessage };
  }
);

export const markMessagesAsRead = createAsyncThunk(
  'chat/markAsRead',
  async ({ chatId, userId }: { chatId: string; userId: string }) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { chatId, userId };
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveChat: (state, action: PayloadAction<string | null>) => {
      state.activeChat = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload.chats;
        state.messages = action.payload.messages;
        state.unreadCount = action.payload.chats.reduce(
          (total, chat) => total + chat.unreadCount, 0
        );
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки чатов';
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { chatId, message } = action.payload;
        if (!state.messages[chatId]) {
          state.messages[chatId] = [];
        }
        state.messages[chatId].push(message);
        
        // Update last message in chat
        const chat = state.chats.find(c => c.id === chatId);
        if (chat) {
          chat.lastMessage = message;
          chat.updatedAt = new Date();
        }
      })
      .addCase(markMessagesAsRead.fulfilled, (state, action) => {
        const { chatId } = action.payload;
        const chat = state.chats.find(c => c.id === chatId);
        if (chat) {
          chat.unreadCount = 0;
          state.unreadCount = state.chats.reduce(
            (total, chat) => total + chat.unreadCount, 0
          );
        }
        
        // Mark messages as read
        if (state.messages[chatId]) {
          state.messages[chatId].forEach(message => {
            message.read = true;
          });
        }
      });
  },
});

export const { setActiveChat, clearError } = chatSlice.actions;
export default chatSlice.reducer; 