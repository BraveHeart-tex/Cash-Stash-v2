import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Budget } from '@prisma/client';
import axios from 'axios';

interface CurrentBudgetState {
  currentBudget: Budget | null;
  isLoading: boolean;
}

const initialState: CurrentBudgetState = {
  currentBudget: null,
  isLoading: false,
};

export const fetchBudgetById = createAsyncThunk(
  'budgets/fetchBudgetById',
  async (budgetId: string) => {
    const response = await axios.get(`/api/user/budgets/${budgetId}`);
    return response.data.budget;
  }
);

const currentBudgetSlice = createSlice({
  name: 'currentBudget',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudgetById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBudgetById.fulfilled, (state, action) => {
        state.currentBudget = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchBudgetById.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default currentBudgetSlice.reducer;
