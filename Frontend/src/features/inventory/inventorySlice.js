import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import inventoryService from './inventoryService';

const initialState = {
  items: [],
  currentItem: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Get all inventory
export const getAllInventory = createAsyncThunk(
  'inventory/getAll',
  async (_, thunkAPI) => {
    try {
      return await inventoryService.getAllInventory();
    } catch (error) {
      const message = error.message || 'Failed to fetch inventory';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get inventory item
export const getInventoryItem = createAsyncThunk(
  'inventory/getItem',
  async (id, thunkAPI) => {
    try {
      return await inventoryService.getInventoryItem(id);
    } catch (error) {
      const message = error.message || 'Failed to fetch item';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create inventory item
export const createInventoryItem = createAsyncThunk(
  'inventory/create',
  async (itemData, thunkAPI) => {
    try {
      return await inventoryService.createInventoryItem(itemData);
    } catch (error) {
      const message = error.message || 'Failed to create item';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update inventory item
export const updateInventoryItem = createAsyncThunk(
  'inventory/update',
  async ({ id, itemData }, thunkAPI) => {
    try {
      return await inventoryService.updateInventoryItem(id, itemData);
    } catch (error) {
      const message = error.message || 'Failed to update item';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete inventory item
export const deleteInventoryItem = createAsyncThunk(
  'inventory/delete',
  async (id, thunkAPI) => {
    try {
      return await inventoryService.deleteInventoryItem(id);
    } catch (error) {
      const message = error.message || 'Failed to delete item';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update stock
export const updateStock = createAsyncThunk(
  'inventory/updateStock',
  async ({ id, quantity }, thunkAPI) => {
    try {
      return await inventoryService.updateStock(id, quantity);
    } catch (error) {
      const message = error.message || 'Failed to update stock';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get low stock items
export const getLowStockItems = createAsyncThunk(
  'inventory/getLowStock',
  async (_, thunkAPI) => {
    try {
      return await inventoryService.getLowStockItems();
    } catch (error) {
      const message = error.message || 'Failed to fetch low stock items';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const inventorySlice = createSlice({
  name: 'inventory',
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
    setCurrentItem: (state, action) => {
      state.currentItem = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all inventory
      .addCase(getAllInventory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllInventory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.items = action.payload;
      })
      .addCase(getAllInventory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get inventory item
      .addCase(getInventoryItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getInventoryItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentItem = action.payload;
      })
      .addCase(getInventoryItem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Create inventory item
      .addCase(createInventoryItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createInventoryItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.items.push(action.payload);
      })
      .addCase(createInventoryItem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update inventory item
      .addCase(updateInventoryItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateInventoryItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateInventoryItem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Delete inventory item
      .addCase(deleteInventoryItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteInventoryItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.items = state.items.filter((item) => item.id !== action.payload.id);
      })
      .addCase(deleteInventoryItem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update stock
      .addCase(updateStock.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateStock.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateStock.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearError, setCurrentItem } = inventorySlice.actions;
export default inventorySlice.reducer;
