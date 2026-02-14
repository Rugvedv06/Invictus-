import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { simulateApiDelay } from '../../services/api';
import { mockInventory, mockEmployees } from '../../mockData';

const initialState = {
  stats: {
    totalItems: 0,
    lowStockItems: 0,
    totalEmployees: 0,
    outOfStock: 0,
  },
  isLoading: false,
  isError: false,
  message: '',
};

// Get dashboard stats
export const getDashboardStats = createAsyncThunk(
  'dashboard/getStats',
  async (_, thunkAPI) => {
    try {
      await simulateApiDelay(null);
      
      const totalItems = mockInventory.length;
      const lowStockItems = mockInventory.filter(
        (item) => item.stock < item.monthlyRequired * 0.2
      ).length;
      const outOfStock = mockInventory.filter((item) => item.stock === 0).length;
      const totalEmployees = mockEmployees.filter(
        (emp) => emp.status === 'active'
      ).length;
      
      return {
        totalItems,
        lowStockItems,
        outOfStock,
        totalEmployees,
      };
    } catch (error) {
      const message = error.message || 'Failed to fetch dashboard stats';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = dashboardSlice.actions;
export default dashboardSlice.reducer;
