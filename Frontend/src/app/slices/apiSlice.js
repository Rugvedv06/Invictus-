import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../../constants/api';
import { APP_CONFIG } from '../../constants/config';
import { storage } from '../../utils/storage';

const baseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
        const token = storage.get(APP_CONFIG.TOKEN_KEY);
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQuery,
    tagTypes: ['User', 'Inventory', 'PCB', 'Production', 'Employee', 'Dashboard', 'Analytics'],
    endpoints: (builder) => ({}),
});
