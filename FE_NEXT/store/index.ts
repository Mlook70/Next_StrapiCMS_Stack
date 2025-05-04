// 1. First, install required packages:
// npm install @reduxjs/toolkit react-redux

// 2. Create a Redux store structure:

// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './slices/searchSlice';
import appointmentReducer from './slices/appointmentSlice';
// Import other reducers as needed
// import languageReducer from './slices/languageSlice';

export const store = configureStore({
  reducer: {
    search: searchReducer,
    appointment: appointmentReducer,
    // Add other reducers
    // language: languageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
