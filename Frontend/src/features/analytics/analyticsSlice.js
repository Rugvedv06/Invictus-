import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import analyticsService from './analyticsService';

const initialState = {
    consumptionSummary: [],
    topConsumed: [],
    lowStock: [],
    pcbProductionSummary: [],
    consumptionTrends: [],
    stockAlerts: [],
    procurementStatus: [],
    loading: false,
    error: null,
};

// Async thunks
export const fetchConsumptionSummary = createAsyncThunk(
    'analytics/fetchConsumptionSummary',
    async (params, { rejectWithValue }) => {
        try {
            return await analyticsService.getConsumptionSummary(params);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchTopConsumed = createAsyncThunk(
    'analytics/fetchTopConsumed',
    async (params, { rejectWithValue }) => {
        try {
            return await analyticsService.getTopConsumedComponents(params);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchLowStock = createAsyncThunk(
    'analytics/fetchLowStock',
    async (params, { rejectWithValue }) => {
        try {
            return await analyticsService.getLowStockComponents(params);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchPCBProductionSummary = createAsyncThunk(
    'analytics/fetchPCBProductionSummary',
    async (params, { rejectWithValue }) => {
        try {
            return await analyticsService.getPCBProductionSummary(params);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchConsumptionTrends = createAsyncThunk(
    'analytics/fetchConsumptionTrends',
    async (params, { rejectWithValue }) => {
        try {
            return await analyticsService.getConsumptionTrends(params);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchStockAlerts = createAsyncThunk(
    'analytics/fetchStockAlerts',
    async (_, { rejectWithValue }) => {
        try {
            return await analyticsService.getStockAlerts();
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchProcurementStatus = createAsyncThunk(
    'analytics/fetchProcurementStatus',
    async (_, { rejectWithValue }) => {
        try {
            return await analyticsService.getProcurementStatus();
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Slice
const analyticsSlice = createSlice({
    name: 'analytics',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Consumption Summary
            .addCase(fetchConsumptionSummary.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchConsumptionSummary.fulfilled, (state, action) => {
                state.loading = false;
                state.consumptionSummary = action.payload;
            })
            .addCase(fetchConsumptionSummary.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Top Consumed
            .addCase(fetchTopConsumed.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTopConsumed.fulfilled, (state, action) => {
                state.loading = false;
                state.topConsumed = action.payload;
            })
            .addCase(fetchTopConsumed.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Low Stock
            .addCase(fetchLowStock.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLowStock.fulfilled, (state, action) => {
                state.loading = false;
                state.lowStock = action.payload;
            })
            .addCase(fetchLowStock.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // PCB Production Summary
            .addCase(fetchPCBProductionSummary.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPCBProductionSummary.fulfilled, (state, action) => {
                state.loading = false;
                state.pcbProductionSummary = action.payload;
            })
            .addCase(fetchPCBProductionSummary.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Consumption Trends
            .addCase(fetchConsumptionTrends.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchConsumptionTrends.fulfilled, (state, action) => {
                state.loading = false;
                state.consumptionTrends = action.payload;
            })
            .addCase(fetchConsumptionTrends.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Stock Alerts
            .addCase(fetchStockAlerts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStockAlerts.fulfilled, (state, action) => {
                state.loading = false;
                state.stockAlerts = action.payload;
            })
            .addCase(fetchStockAlerts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Procurement Status
            .addCase(fetchProcurementStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProcurementStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.procurementStatus = action.payload;
            })
            .addCase(fetchProcurementStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError } = analyticsSlice.actions;
export default analyticsSlice.reducer;
