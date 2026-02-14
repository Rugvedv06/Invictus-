import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import pcbService from './pcbService';

const initialState = {
    pcbs: [],
    currentPCB: null,
    pcbComponents: [],
    productions: [],
    loading: false,
    error: null,
    success: false,
};

// Async thunks
export const fetchPCBs = createAsyncThunk(
    'pcbs/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            return await pcbService.getAllPCBs(params);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchPCBById = createAsyncThunk(
    'pcbs/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            return await pcbService.getPCBById(id);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createPCB = createAsyncThunk(
    'pcbs/create',
    async (pcbData, { rejectWithValue }) => {
        try {
            return await pcbService.createPCB(pcbData);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updatePCB = createAsyncThunk(
    'pcbs/update',
    async ({ id, pcbData }, { rejectWithValue }) => {
        try {
            return await pcbService.updatePCB(id, pcbData);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deletePCB = createAsyncThunk(
    'pcbs/delete',
    async (id, { rejectWithValue }) => {
        try {
            await pcbService.deletePCB(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchPCBComponents = createAsyncThunk(
    'pcbs/fetchComponents',
    async (pcbId, { rejectWithValue }) => {
        try {
            return await pcbService.getPCBComponents(pcbId);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const addComponentToPCB = createAsyncThunk(
    'pcbs/addComponent',
    async ({ pcbId, componentData }, { rejectWithValue }) => {
        try {
            return await pcbService.addComponentToPCB(pcbId, componentData);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const removePCBComponent = createAsyncThunk(
    'pcbs/removeComponent',
    async ({ pcbId, componentId, mappingId }, { rejectWithValue }) => {
        try {
            await pcbService.removePCBComponent(pcbId, componentId);
            return { componentId, mappingId };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createProduction = createAsyncThunk(
    'pcbs/createProduction',
    async (productionData, { rejectWithValue }) => {
        try {
            return await pcbService.createProduction(productionData);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchProductions = createAsyncThunk(
    'pcbs/fetchProductions',
    async (params, { rejectWithValue }) => {
        try {
            return await pcbService.getAllProductions(params);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Slice
const pcbSlice = createSlice({
    name: 'pcbs',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = false;
        },
        setCurrentPCB: (state, action) => {
            state.currentPCB = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all PCBs
            .addCase(fetchPCBs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPCBs.fulfilled, (state, action) => {
                state.loading = false;
                state.pcbs = action.payload;
            })
            .addCase(fetchPCBs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch PCB by ID
            .addCase(fetchPCBById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPCBById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentPCB = action.payload;
            })
            .addCase(fetchPCBById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create PCB
            .addCase(createPCB.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createPCB.fulfilled, (state, action) => {
                state.loading = false;
                state.pcbs.push(action.payload);
                state.success = true;
            })
            .addCase(createPCB.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update PCB
            .addCase(updatePCB.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updatePCB.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.pcbs.findIndex(pcb => pcb.id === action.payload.id);
                if (index !== -1) {
                    state.pcbs[index] = action.payload;
                }
                state.currentPCB = action.payload;
                state.success = true;
            })
            .addCase(updatePCB.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete PCB
            .addCase(deletePCB.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePCB.fulfilled, (state, action) => {
                state.loading = false;
                state.pcbs = state.pcbs.filter(pcb => pcb.id !== action.payload);
                state.success = true;
            })
            .addCase(deletePCB.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch PCB components
            .addCase(fetchPCBComponents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPCBComponents.fulfilled, (state, action) => {
                state.loading = false;
                state.pcbComponents = action.payload;
            })
            .addCase(fetchPCBComponents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add component to PCB
            .addCase(addComponentToPCB.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(addComponentToPCB.fulfilled, (state, action) => {
                state.loading = false;
                state.pcbComponents.push(action.payload);
                state.success = true;
            })
            .addCase(addComponentToPCB.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Remove component from PCB
            .addCase(removePCBComponent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removePCBComponent.fulfilled, (state, action) => {
                state.loading = false;
                const { componentId, mappingId } = action.payload;
                state.pcbComponents = state.pcbComponents.filter(
                    comp => comp.id !== mappingId && comp.component_id !== componentId
                );
                state.success = true;
            })
            .addCase(removePCBComponent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create production
            .addCase(createProduction.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createProduction.fulfilled, (state, action) => {
                state.loading = false;
                state.productions.unshift(action.payload);
                state.success = true;
            })
            .addCase(createProduction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch productions
            .addCase(fetchProductions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductions.fulfilled, (state, action) => {
                state.loading = false;
                state.productions = action.payload;
            })
            .addCase(fetchProductions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, clearSuccess, setCurrentPCB } = pcbSlice.actions;
export default pcbSlice.reducer;
