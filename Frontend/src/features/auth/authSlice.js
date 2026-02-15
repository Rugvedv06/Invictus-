import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';
import { storage } from '../../utils/storage';
import { APP_CONFIG } from '../../constants';

// Get user from localStorage
const user = storage.get(APP_CONFIG.USER_KEY);
const token = storage.get(APP_CONFIG.TOKEN_KEY);

const initialState = {
  user: user || null,
  token: token || null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, thunkAPI) => {
    try {
      const data = await authService.login(credentials);
      storage.set(APP_CONFIG.TOKEN_KEY, data.token);
      storage.set(APP_CONFIG.USER_KEY, data.user);
      return data;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (payload, thunkAPI) => {
    try {
      const data = await authService.register(payload);
      // do not auto-login; user should explicitly login
      return data;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Logout user
export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await authService.logout();
    storage.remove(APP_CONFIG.TOKEN_KEY);
    storage.remove(APP_CONFIG.USER_KEY);
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Something went wrong';
    return thunkAPI.rejectWithValue(message);
  }
});

// Validate token
export const validateToken = createAsyncThunk(
  'auth/validateToken',
  async (_, thunkAPI) => {
    try {
      const token = storage.get(APP_CONFIG.TOKEN_KEY);
      if (!token) {
        throw new Error('No token found');
      }
      const isValid = await authService.validateToken();
      if (!isValid) {
        throw new Error('Invalid token');
      }
      return { isValid };
    } catch (error) {
      storage.remove(APP_CONFIG.TOKEN_KEY);
      storage.remove(APP_CONFIG.USER_KEY);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Token validation failed';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearError: (state) => {
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.token = null;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // backend returns created user (not logged in) - do not set token
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
      })
      .addCase(logout.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
      })
      // Validate Token
      .addCase(validateToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(validateToken.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(validateToken.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { reset, clearError } = authSlice.actions;
export default authSlice.reducer;
