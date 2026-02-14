import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import employeeService from './employeeService';

const initialState = {
  employees: [],
  currentEmployee: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Get all employees
export const getAllEmployees = createAsyncThunk(
  'employees/getAll',
  async (_, thunkAPI) => {
    try {
      return await employeeService.getAllEmployees();
    } catch (error) {
      const message = error.message || 'Failed to fetch employees';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get employee
export const getEmployee = createAsyncThunk(
  'employees/getEmployee',
  async (id, thunkAPI) => {
    try {
      return await employeeService.getEmployee(id);
    } catch (error) {
      const message = error.message || 'Failed to fetch employee';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create employee
export const createEmployee = createAsyncThunk(
  'employees/create',
  async (employeeData, thunkAPI) => {
    try {
      return await employeeService.createEmployee(employeeData);
    } catch (error) {
      const message = error.message || 'Failed to create employee';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update employee
export const updateEmployee = createAsyncThunk(
  'employees/update',
  async ({ id, employeeData }, thunkAPI) => {
    try {
      return await employeeService.updateEmployee(id, employeeData);
    } catch (error) {
      const message = error.message || 'Failed to update employee';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete employee
export const deleteEmployee = createAsyncThunk(
  'employees/delete',
  async (id, thunkAPI) => {
    try {
      return await employeeService.deleteEmployee(id);
    } catch (error) {
      const message = error.message || 'Failed to delete employee';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const employeeSlice = createSlice({
  name: 'employees',
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
      // Get all employees
      .addCase(getAllEmployees.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllEmployees.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.employees = action.payload;
      })
      .addCase(getAllEmployees.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get employee
      .addCase(getEmployee.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getEmployee.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentEmployee = action.payload;
      })
      .addCase(getEmployee.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Create employee
      .addCase(createEmployee.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.employees.push(action.payload);
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update employee
      .addCase(updateEmployee.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.employees.findIndex((emp) => emp.id === action.payload.id);
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Delete employee
      .addCase(deleteEmployee.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.employees = state.employees.filter((emp) => emp.id !== action.payload.id);
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearError } = employeeSlice.actions;
export default employeeSlice.reducer;
