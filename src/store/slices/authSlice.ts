import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User, LoginForm, RegisterForm, UserRole } from '../../types';

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

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginForm) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication
    const mockUser: User = {
      id: '1',
      name: 'Иван Петров',
      email: credentials.email,
      role: credentials.email === 'admin@example.com' ? UserRole.ADMIN : 
            credentials.email === 'master@example.com' ? UserRole.MASTER : UserRole.CLIENT,
      phone: '+7 (999) 123-45-67',
      createdAt: new Date(),
    };
    
    return mockUser;
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterForm) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      role: userData.role,
      phone: userData.phone,
      createdAt: new Date(),
    };
    
    return newUser;
  }
);

export const updateProfileAsync = createAsyncThunk(
  'auth/updateProfile',
  async (profileData: { name: string; phone: string }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return profileData;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      })
      // Update Profile
      .addCase(updateProfileAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfileAsync.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) {
          state.user.name = action.payload.name;
          state.user.phone = action.payload.phone;
        }
      })
      .addCase(updateProfileAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Profile update failed';
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export { updateProfileAsync as updateProfile };
export default authSlice.reducer; 