import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ChatMessage, SendMessageRequest } from '../../types';
import { chatAPI } from '../../api/chat';

interface ChatState {
  conversations: any[];
  messages: ChatMessage[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  conversations: [],
  messages: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async () => {
    const response = await chatAPI.getConversations();
    return response.data;
  }
);

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (userId: string) => {
    const response = await chatAPI.getConversation(userId);
    return response.data;
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (messageData: SendMessageRequest) => {
    const response = await chatAPI.sendMessage(messageData);
    return response.data;
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'chat/fetchUnreadCount',
  async () => {
    const response = await chatAPI.getUnreadCount();
    return response.data;
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.conversations = action.payload;
      })
      .addCase(fetchMessages.fulfilled, (state, action: PayloadAction<ChatMessage[]>) => {
        state.messages = action.payload;
      })
      .addCase(sendMessage.fulfilled, (state, action: PayloadAction<ChatMessage>) => {
        state.messages.push(action.payload);
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action: PayloadAction<number>) => {
        state.unreadCount = action.payload;
      });
  },
});

export const { clearError, addMessage } = chatSlice.actions;
export default chatSlice.reducer; 