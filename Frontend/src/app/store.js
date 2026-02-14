import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import inventoryReducer from '../features/inventory/inventorySlice';
import employeeReducer from '../features/employees/employeeSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import pcbReducer from '../features/pcb/pcbSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    inventory: inventoryReducer,
    employees: employeeReducer,
    dashboard: dashboardReducer,
    pcbs: pcbReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
