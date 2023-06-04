import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Budget } from '@prisma/client';
import axios from 'axios';

interface BudgetsState {
  budgets: Budget[] | null;
  isLoading: boolean;
  isCreateBudgetModalOpen: boolean;
  isDeleteBudgetModalOpen: boolean;
  isEditBudgetModalOpen: boolean;
  selectedBudgetId: number;
}

const initialState: BudgetsState = {
  budgets: null,
  isLoading: false,
  isCreateBudgetModalOpen: false,
  isDeleteBudgetModalOpen: false,
  isEditBudgetModalOpen: false,
  selectedBudgetId: 0,
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
  reducers: {
    setCreateBudgetModalOpen: (state, action) => {
      state.isCreateBudgetModalOpen = action.payload;
    },
    setDeleteBudgetModalOpen: (state, action) => {
      state.isDeleteBudgetModalOpen = action.payload.isDeleteBudgetModalOpen;
      state.selectedBudgetId = action.payload.selectedBudgetId;
    },
    setEditBudgetModalOpen: (state, action) => {
      state.isEditBudgetModalOpen = action.payload.isEditBudgetModalOpen;
      state.selectedBudgetId = action.payload.selectedBudgetId;
    },
  },
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

export const {
  setCreateBudgetModalOpen,
  setDeleteBudgetModalOpen,
  setEditBudgetModalOpen,
} = budgetSlice.actions;
export default budgetSlice.reducer;
