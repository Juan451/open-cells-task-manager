import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './tasksSlice.js';
import authReducer from './authSlice.js';

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    auth: authReducer,
  },
});
