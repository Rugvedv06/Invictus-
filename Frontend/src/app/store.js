import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice';
import { apiSlice } from './slices/apiSlice';
import authReducer from '../features/auth/authSlice';
import inventoryReducer from '../features/inventory/inventorySlice';
import employeeReducer from '../features/employees/employeeSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import pcbReducer from '../features/pcb/pcbSlice';
import analyticsReducer from '../features/analytics/analyticsSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    inventory: inventoryReducer,
    employees: employeeReducer,
    dashboard: dashboardReducer,
    pcbs: pcbReducer,
    analytics: analyticsReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiSlice.middleware),

  // Optional: enable Redux DevTools automatically in dev
  devTools: import.meta.env.DEV,
});

export default store;
