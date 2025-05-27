import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { LoyaltyAccount, LoyaltyTransaction, LoyaltyTier, Promotion } from '../../types';

interface LoyaltyState {
  account: LoyaltyAccount | null;
  transactions: LoyaltyTransaction[];
  promotions: Promotion[];
  loading: boolean;
  error: string | null;
}

const initialState: LoyaltyState = {
  account: null,
  transactions: [],
  promotions: [],
  loading: false,
  error: null,
};

// Mock data
const mockAccount: LoyaltyAccount = {
  id: '1',
  userId: '1',
  points: 1250,
  totalEarned: 3500,
  totalSpent: 2250,
  tier: LoyaltyTier.SILVER,
  createdAt: new Date('2024-01-01T00:00:00'),
  updatedAt: new Date('2024-01-15T12:00:00'),
};

const mockTransactions: LoyaltyTransaction[] = [
  {
    id: '1',
    accountId: '1',
    type: 'earn',
    points: 150,
    description: 'Бонус за заказ услуги "Замена масла"',
    relatedOrderId: '1',
    createdAt: new Date('2024-01-15T12:00:00'),
  },
  {
    id: '2',
    accountId: '1',
    type: 'spend',
    points: 500,
    description: 'Скидка на покупку деталей',
    relatedOrderId: '2',
    createdAt: new Date('2024-01-10T14:30:00'),
  },
  {
    id: '3',
    accountId: '1',
    type: 'earn',
    points: 200,
    description: 'Бонус за отзыв',
    createdAt: new Date('2024-01-08T16:00:00'),
  },
];

const mockPromotions: Promotion[] = [
  {
    id: '1',
    title: 'Скидка 10% на диагностику',
    description: 'Получите скидку 10% на любую диагностику при заказе от 3000 рублей',
    type: 'discount',
    value: 10,
    minOrderAmount: 3000,
    validFrom: new Date('2024-01-01T00:00:00'),
    validTo: new Date('2024-02-29T23:59:59'),
    isActive: true,
    usageLimit: 100,
    usedCount: 23,
    applicableServices: ['2'],
    applicableTiers: [LoyaltyTier.SILVER, LoyaltyTier.GOLD, LoyaltyTier.PLATINUM],
  },
  {
    id: '2',
    title: 'Двойные баллы за ТО',
    description: 'Получайте двойные баллы за техническое обслуживание',
    type: 'bonus_points',
    value: 2,
    validFrom: new Date('2024-01-15T00:00:00'),
    validTo: new Date('2024-01-31T23:59:59'),
    isActive: true,
    usageLimit: 50,
    usedCount: 12,
    applicableServices: ['1'],
    applicableTiers: [LoyaltyTier.GOLD, LoyaltyTier.PLATINUM],
  },
];

export const fetchLoyaltyAccount = createAsyncThunk(
  'loyalty/fetchAccount',
  async (userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockAccount;
  }
);

export const fetchLoyaltyTransactions = createAsyncThunk(
  'loyalty/fetchTransactions',
  async (accountId: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockTransactions.filter(t => t.accountId === accountId);
  }
);

export const fetchPromotions = createAsyncThunk(
  'loyalty/fetchPromotions',
  async (tier?: LoyaltyTier) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filteredPromotions = mockPromotions.filter(p => p.isActive);
    
    if (tier) {
      filteredPromotions = filteredPromotions.filter(p => 
        !p.applicableTiers || p.applicableTiers.includes(tier)
      );
    }
    
    return filteredPromotions;
  }
);

export const earnPoints = createAsyncThunk(
  'loyalty/earnPoints',
  async (data: {
    accountId: string;
    points: number;
    description: string;
    relatedOrderId?: string;
  }) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const transaction: LoyaltyTransaction = {
      id: Date.now().toString(),
      accountId: data.accountId,
      type: 'earn',
      points: data.points,
      description: data.description,
      relatedOrderId: data.relatedOrderId,
      createdAt: new Date(),
    };
    
    return transaction;
  }
);

export const spendPoints = createAsyncThunk(
  'loyalty/spendPoints',
  async (data: {
    accountId: string;
    points: number;
    description: string;
    relatedOrderId?: string;
  }) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const transaction: LoyaltyTransaction = {
      id: Date.now().toString(),
      accountId: data.accountId,
      type: 'spend',
      points: data.points,
      description: data.description,
      relatedOrderId: data.relatedOrderId,
      createdAt: new Date(),
    };
    
    return transaction;
  }
);

const getTierFromPoints = (totalEarned: number): LoyaltyTier => {
  if (totalEarned >= 10000) return LoyaltyTier.PLATINUM;
  if (totalEarned >= 5000) return LoyaltyTier.GOLD;
  if (totalEarned >= 2000) return LoyaltyTier.SILVER;
  return LoyaltyTier.BRONZE;
};

const loyaltySlice = createSlice({
  name: 'loyalty',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoyaltyAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLoyaltyAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.account = action.payload;
      })
      .addCase(fetchLoyaltyAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки аккаунта лояльности';
      })
      .addCase(fetchLoyaltyTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload;
      })
      .addCase(fetchPromotions.fulfilled, (state, action) => {
        state.promotions = action.payload;
      })
      .addCase(earnPoints.fulfilled, (state, action) => {
        state.transactions.unshift(action.payload);
        
        if (state.account) {
          state.account.points += action.payload.points;
          state.account.totalEarned += action.payload.points;
          state.account.tier = getTierFromPoints(state.account.totalEarned);
          state.account.updatedAt = new Date();
        }
      })
      .addCase(spendPoints.fulfilled, (state, action) => {
        state.transactions.unshift(action.payload);
        
        if (state.account) {
          state.account.points -= action.payload.points;
          state.account.totalSpent += action.payload.points;
          state.account.updatedAt = new Date();
        }
      });
  },
});

export const { clearError } = loyaltySlice.actions;
export default loyaltySlice.reducer; 