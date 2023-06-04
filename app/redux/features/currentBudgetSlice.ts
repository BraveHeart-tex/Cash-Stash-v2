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

interface FetchCurrentBudgetResponse {
  budget: Budget;
}

export const fetchBudgetById = createAsyncThunk(
  'budgets/fetchBudgetById',
  async (budgetId: number) => {
    try {
      const response = await axios.get<FetchCurrentBudgetResponse>(
        `/api/user/budgets/${budgetId}`
      );
      return response.data.budget;
    } catch (error) {
      console.log(error);
      throw error;
    }
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
