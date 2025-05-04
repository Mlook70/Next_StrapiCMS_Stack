// src/store/slices/searchSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

// Define the state structure for search
interface SearchState {
  query: string;
  activeTab: 'all' | 'team' | 'services';
  currentPage: number;
  pageSize: number;
}

// Initialize the state
const initialState: SearchState = {
  query: '',
  activeTab: 'all',
  currentPage: 1,
  pageSize: 9, // Show 9 items per page
};

// Create the slice
export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    clearQuery: (state) => {
      state.query = '';
    },
    setActiveTab: (state, action: PayloadAction<'all' | 'team' | 'services'>) => {
      state.activeTab = action.payload;
      // Reset to page 1 when tab changes
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    nextPage: (state, action: PayloadAction<number>) => {
      if (state.currentPage < action.payload) {
        state.currentPage += 1;
      }
    },
    prevPage: (state) => {
      if (state.currentPage > 1) {
        state.currentPage -= 1;
      }
    }
  },
});

// Export actions
export const {
  setQuery,
  clearQuery,
  setActiveTab,
  setCurrentPage,
  nextPage,
  prevPage
} = searchSlice.actions;

// Export selectors
export const selectQuery = (state: RootState) => state.search.query;
export const selectActiveTab = (state: RootState) => state.search.activeTab;
export const selectCurrentPage = (state: RootState) => state.search.currentPage;
export const selectPageSize = (state: RootState) => state.search.pageSize;

// Export reducer
export default searchSlice.reducer;