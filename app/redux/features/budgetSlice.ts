import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Budget } from '@prisma/client';
import axios from 'axios';

interface UserAccountsState {
  budgets: Budget[] | null;
  isLoading: boolean;
}

const initialState: UserAccountsState = {
  budgets: null,
  isLoading: false,
};

export const fetchBudgets = createAsyncThunk(
  'budgets/fetchBudgets',
  async () => {
    const response = await axios.get(`/api/user/budgets`);
    return response.data.budgets;
  }
);

const budgetSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudgets.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.budgets = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchBudgets.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default budgetSlice.reducer;
