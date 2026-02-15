import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/api';
import { ROUTES } from '../../constants';

const MAX_NOTIFICATIONS = 50;

const initialState = {
  items: [],
  unreadCount: 0,
  permission:
    typeof window !== 'undefined' && 'Notification' in window
      ? window.Notification.permission
      : 'unsupported',
  isPolling: false,
  lastPolledAt: null,
  lastSnapshot: {
    initialized: false,
    lowStockKeys: [],
    procurementStatusById: {},
  },
  error: null,
};

const createNotification = ({ type, title, message, severity = 'info', route }) => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
  type,
  title,
  message,
  severity,
  route: route || null,
  isRead: false,
  createdAt: new Date().toISOString(),
});

const sendBrowserNotification = (entry, permission) => {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (permission !== 'granted') return;

  try {
    const notification = new window.Notification(entry.title, {
      body: entry.message,
      tag: `${entry.type}-${entry.title}`,
      silent: false,
    });

    setTimeout(() => notification.close(), 6000);
  } catch {
    // noop: browser/runtime can block notifications
  }
};

const playNotificationSound = (permission) => {
  if (typeof window === 'undefined') return;
  if (permission !== 'granted') return;

  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    const audioContext = new AudioContextClass();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime);

    gainNode.gain.setValueAtTime(0.001, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.08, audioContext.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.28);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (audioContext.state === 'suspended') {
      audioContext.resume().catch(() => {});
    }

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
    oscillator.onended = () => {
      audioContext.close().catch(() => {});
    };
  } catch {
    // noop: some browsers block autoplay audio until user gesture
  }
};

export const requestBrowserPermission = createAsyncThunk(
  'notifications/requestPermission',
  async (_, thunkAPI) => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'unsupported';
    }

    try {
      const permission = await window.Notification.requestPermission();
      return permission;
    } catch {
      return thunkAPI.rejectWithValue('Unable to request notification permission');
    }
  }
);

export const pollNotifications = createAsyncThunk(
  'notifications/poll',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const auth = state.auth || {};

    if (!auth.token || !auth.user) {
      return { skipped: true };
    }

    const isAdmin = String(auth.user.role || '').toLowerCase() === 'admin';

    try {
      const requests = [api.get('/dashboard/low-stock-components')];
      if (isAdmin) {
        requests.push(api.get('/procurement'));
      }

      const [lowStockRes, procurementRes] = await Promise.all(requests);
      const lowStockItems = lowStockRes?.data || [];
      const procurementItems = procurementRes?.data || [];

      const prevSnapshot = state.notifications.lastSnapshot;
      const isFirstPoll = !prevSnapshot.initialized;

      const lowStockKeys = lowStockItems.map((item) =>
        String(item.id || item.component_id || item.part_number || item.component_name)
      );

      const procurementStatusById = procurementItems.reduce((acc, item) => {
        acc[String(item.id)] = String(item.status || 'pending').toLowerCase();
        return acc;
      }, {});

      const generated = [];

      if (!isFirstPoll) {
        const prevLowStock = new Set(prevSnapshot.lowStockKeys || []);
        const currentLowStock = new Set(lowStockKeys);

        for (const component of lowStockItems) {
          const key = String(
            component.id || component.component_id || component.part_number || component.component_name
          );
          if (!prevLowStock.has(key)) {
            generated.push(
              createNotification({
                type: 'low-stock',
                severity: 'warning',
                title: 'Low stock alert',
                message: `${component.part_number || component.component_name} dropped to low stock.`,
                route: ROUTES.INVENTORY,
              })
            );
          }
        }

        for (const oldKey of prevLowStock) {
          if (!currentLowStock.has(oldKey)) {
            generated.push(
              createNotification({
                type: 'stock-recovered',
                severity: 'success',
                title: 'Stock recovered',
                message: 'A previously low-stock component is back to safe level.',
                route: ROUTES.INVENTORY,
              })
            );
          }
        }

        if (isAdmin) {
          const prevProcurement = prevSnapshot.procurementStatusById || {};

          for (const trigger of procurementItems) {
            const triggerId = String(trigger.id);
            const currentStatus = String(trigger.status || 'pending').toLowerCase();
            const previousStatus = prevProcurement[triggerId];

            if (!previousStatus && currentStatus === 'pending') {
              generated.push(
                createNotification({
                  type: 'procurement-new',
                  severity: 'warning',
                  title: 'New procurement trigger',
                  message: `${trigger.component_name || 'Component'} requires procurement action.`,
                  route: ROUTES.ANALYTICS,
                })
              );
            } else if (previousStatus && previousStatus !== currentStatus) {
              generated.push(
                createNotification({
                  type: 'procurement-status',
                  severity: currentStatus === 'received' ? 'success' : 'info',
                  title: 'Procurement status updated',
                  message: `${trigger.component_name || 'Component'} changed to ${currentStatus}.`,
                  route: ROUTES.ANALYTICS,
                })
              );
            }
          }
        }
      }

      if (generated.length > 0) {
        thunkAPI.dispatch(pushNotifications(generated));

        const permission = state.notifications.permission;
        generated.forEach((entry) => sendBrowserNotification(entry, permission));
        playNotificationSound(permission);
      }

      return {
        generatedCount: generated.length,
        snapshot: {
          initialized: true,
          lowStockKeys,
          procurementStatusById,
        },
      };
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || 'Failed to fetch notification sources';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    pushNotifications: (state, action) => {
      const incoming = Array.isArray(action.payload) ? action.payload : [action.payload];
      state.items = [...incoming, ...state.items].slice(0, MAX_NOTIFICATIONS);
      state.unreadCount = state.items.filter((item) => !item.isRead).length;
    },
    markNotificationRead: (state, action) => {
      const target = state.items.find((item) => item.id === action.payload);
      if (target) {
        target.isRead = true;
      }
      state.unreadCount = state.items.filter((item) => !item.isRead).length;
    },
    markAllNotificationsRead: (state) => {
      state.items = state.items.map((item) => ({ ...item, isRead: true }));
      state.unreadCount = 0;
    },
    clearNotifications: (state) => {
      state.items = [];
      state.unreadCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestBrowserPermission.fulfilled, (state, action) => {
        state.permission = action.payload;
      })
      .addCase(pollNotifications.pending, (state) => {
        state.isPolling = true;
        state.error = null;
      })
      .addCase(pollNotifications.fulfilled, (state, action) => {
        state.isPolling = false;
        state.lastPolledAt = new Date().toISOString();

        if (!action.payload?.skipped && action.payload?.snapshot) {
          state.lastSnapshot = action.payload.snapshot;
        }
      })
      .addCase(pollNotifications.rejected, (state, action) => {
        state.isPolling = false;
        state.error = action.payload || 'Notification polling failed';
      })
      .addCase('auth/logout/fulfilled', (state) => {
        state.items = [];
        state.unreadCount = 0;
        state.lastSnapshot = {
          initialized: false,
          lowStockKeys: [],
          procurementStatusById: {},
        };
        state.error = null;
      });
  },
});

export const {
  pushNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
