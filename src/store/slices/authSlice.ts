import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authAPI } from '../../api/auth';
import { usersAPI } from '../../api/users';
import type { User, LoginRequest, RegisterRequest } from '../../types';
import { USER_ROLES, LOYALTY_LEVELS } from '../../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Вспомогательная функция для создания пользователя
const createUserFromAuthResponse = (data: any, fallbackEmail?: string): User => ({
  id: data.userId || data.id || 'unknown',
  email: data.email || fallbackEmail || '',
  firstName: data.firstName || 'Пользователь',
  lastName: data.lastName || '',
  phone: data.phone || '',
  role: data.role || USER_ROLES.CLIENT,
  loyaltyLevel: data.loyaltyLevel || LOYALTY_LEVELS.BRONZE,
  loyaltyPoints: data.loyaltyPoints || 0,
  isActive: data.isActive !== undefined ? data.isActive : true,
  createdAt: data.createdAt || new Date().toISOString(),
});

// Вспомогательная функция для работы с токенами
const setTokens = (accessToken: string, refreshToken: string) => {
  console.log('💾 Saving tokens:', { 
    accessToken: accessToken ? `${accessToken.substring(0, 20)}...` : 'No token',
    refreshToken: refreshToken ? `${refreshToken.substring(0, 20)}...` : 'No token'
  });
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

const clearTokens = () => {
  console.log('🗑️ Clearing tokens', new Error().stack);
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      console.log('🔄 login - Making login request for:', credentials.email);
      const response = await authAPI.login(credentials);
      console.log('✅ login - Full response:', response);
      
      // Backend возвращает обернутый ответ: { success: true, data: AuthResponse }
      const authData = response.data.data || response.data || response;
      console.log('✅ login - Auth data:', authData);
      
      setTokens(authData.accessToken, authData.refreshToken);
      const user = createUserFromAuthResponse(authData, credentials.email);
      console.log('✅ login - Created user:', user);
      return user;
    } catch (error: any) {
      console.log('❌ login - Error:', error);
      return rejectWithValue(error.response?.data?.message || 'Ошибка входа');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);
      // Backend возвращает обернутый ответ: { success: true, data: AuthResponse }
      const authData = response.data.data || response.data || response;
      setTokens(authData.accessToken, authData.refreshToken);
      
      return {
        ...createUserFromAuthResponse(authData),
        phone: userData.phone,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка регистрации');
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      console.log('🔍 checkAuth - token check:', token ? `${token.substring(0, 20)}...` : 'No token found');
      
      if (!token) {
        console.log('❌ checkAuth - No token found, rejecting');
        throw new Error('No token');
      }
      
      console.log('🔄 checkAuth - Making profile request...');
      const response = await usersAPI.getProfile();
      console.log('✅ checkAuth - Profile response:', response.data);
      
      // Backend возвращает обернутый ответ: { success: true, data: UserProfileDTO }
      const userData = response.data.data || response.data;
      const user = createUserFromAuthResponse(userData);
      console.log('✅ checkAuth - Created user:', user);
      return user;
    } catch (error: any) {
      console.log('❌ checkAuth - Error:', error.message);
      clearTokens();
      return rejectWithValue('Не авторизован');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await authAPI.logout();
  } catch (error) {
    // Игнорируем ошибки при выходе
  } finally {
    clearTokens();
  }
});

export const loadProfile = createAsyncThunk(
  'auth/loadProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await usersAPI.getProfile();
      // Backend возвращает обернутый ответ: { success: true, data: UserProfileDTO }
      const userData = response.data.data || response.data;
      return createUserFromAuthResponse(userData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки профиля');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await usersAPI.updateProfile(profileData);
      // Backend возвращает обернутый ответ: { success: true, data: UserProfileDTO }  
      const userData = response.data.data || response.data;
      return createUserFromAuthResponse(userData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка обновления профиля');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Общий паттерн для pending
    const setPending = (state: AuthState) => {
      state.loading = true;
      state.error = null;
    };

    // Общий паттерн для successful auth
    const setAuthSuccess = (state: AuthState, action: PayloadAction<User>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    };

    // Общий паттерн для rejected
    const setRejected = (state: AuthState, action: any) => {
      state.loading = false;
      state.error = action.payload as string;
    };

    builder
      // Login
      .addCase(login.pending, setPending)
      .addCase(login.fulfilled, setAuthSuccess)
      .addCase(login.rejected, setRejected)
      
      // Register
      .addCase(register.pending, setPending)
      .addCase(register.fulfilled, setAuthSuccess)
      .addCase(register.rejected, setRejected)
      
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      })
      
      // Load Profile
      .addCase(loadProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
      })
      
      // Update Profile
      .addCase(updateProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, setRejected);
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer; 