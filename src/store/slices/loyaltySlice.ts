import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../api/client';

export interface LoyaltyTransaction {
  id: string;
  userId: string;
  type: 'EARNED' | 'SPENT' | 'EXPIRED' | 'BONUS';
  points: number;
  description: string;
  appointmentId?: string;
  orderId?: string;
  expiryDate?: string;
  createdAt: string;
}

export interface LoyaltyState {
  level: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  points: number;
  transactions: LoyaltyTransaction[];
  levelBenefits: {
    [key: string]: {
      discountPercent: number;
      bonusMultiplier: number;
      description: string;
    };
  };
  loading: boolean;
  error: string | null;
}

const initialState: LoyaltyState = {
  level: 'BRONZE',
  points: 0,
  transactions: [],
  levelBenefits: {
    BRONZE: {
      discountPercent: 0,
      bonusMultiplier: 1,
      description: 'Базовый уровень - накопление баллов с каждой услуги',
    },
    SILVER: {
      discountPercent: 5,
      bonusMultiplier: 1.2,
      description: 'Скидка 5% на все услуги, ускоренное накопление баллов',
    },
    GOLD: {
      discountPercent: 10,
      bonusMultiplier: 1.5,
      description: 'Скидка 10% на все услуги, приоритетная запись',
    },
    PLATINUM: {
      discountPercent: 15,
      bonusMultiplier: 2,
      description: 'Скидка 15%, VIP обслуживание, персональный мастер',
    },
  },
  loading: false,
  error: null,
};

// Загрузка данных лояльности из профиля пользователя
export const fetchLoyaltyData = createAsyncThunk(
  'loyalty/fetchLoyaltyData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/users/profile');
      return {
        level: response.data.loyaltyLevel || 'BRONZE',
        points: response.data.loyaltyPoints || 0
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки данных лояльности');
    }
  }
);

// Получение истории транзакций (TODO: когда backend добавит LoyaltyController)
export const fetchLoyaltyTransactions = createAsyncThunk(
  'loyalty/fetchTransactions',
  async () => {
    try {
      // Пока backend не готов, используем пустой массив
      // TODO: Когда backend добавит endpoint /loyalty/transactions
      // const response = await apiClient.get('/loyalty/transactions');
      // return response.data;
      
      return [];
    } catch (error: any) {
      throw new Error('Ошибка загрузки истории транзакций');
    }
  }
);

// Трата баллов (TODO: когда backend добавит endpoint)
export const spendLoyaltyPoints = createAsyncThunk(
  'loyalty/spendPoints',
  async (params: { points: number; description: string; appointmentId?: string }) => {
    try {
      // TODO: Когда backend добавит endpoint /loyalty/spend
      // const response = await apiClient.post('/loyalty/spend', params);
      // return response.data;
      
      // Пока возвращаем успешную транзакцию
      const newTransaction: LoyaltyTransaction = {
        id: Date.now().toString(),
        userId: 'current-user',
        type: 'SPENT',
        points: params.points,
        description: params.description,
        appointmentId: params.appointmentId,
        createdAt: new Date().toISOString(),
      };
      
      return newTransaction;
    } catch (error: any) {
      throw new Error('Ошибка списания баллов');
    }
  }
);

const loyaltySlice = createSlice({
  name: 'loyalty',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Локальное обновление баллов (когда получаем обновленный профиль)
    updateLoyaltyInfo: (state, action) => {
      state.level = action.payload.level;
      state.points = action.payload.points;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoyaltyData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLoyaltyData.fulfilled, (state, action) => {
        state.loading = false;
        state.level = action.payload.level;
        state.points = action.payload.points;
      })
      .addCase(fetchLoyaltyData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки данных лояльности';
      })
      .addCase(fetchLoyaltyTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload;
      })
      .addCase(spendLoyaltyPoints.fulfilled, (state, action) => {
        state.transactions.unshift(action.payload);
        state.points = Math.max(0, state.points - action.payload.points);
      });
  },
});

export const { clearError, updateLoyaltyInfo } = loyaltySlice.actions;
export default loyaltySlice.reducer; 