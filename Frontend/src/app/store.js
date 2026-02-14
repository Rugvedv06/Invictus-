import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import inventoryReducer from '../features/inventory/inventorySlice';
import employeeReducer from '../features/employees/employeeSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    inventory: inventoryReducer,
    employees: employeeReducer,
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
