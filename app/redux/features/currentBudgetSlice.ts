import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Budget } from "@prisma/client";
import { getBudgetByIdAction } from "@/actions";

interface CurrentBudgetState {
  currentBudget: Budget | null;
  isLoading: boolean;
}

const initialState: CurrentBudgetState = {
  currentBudget: null,
  isLoading: false,
};

export const fetchBudgetById = createAsyncThunk(
  "budgets/fetchBudgetById",
  async (budgetId: number) => {
    try {
      const { budget, error } = await getBudgetByIdAction(budgetId);
      if (error || !budget) {
        return null;
      }

      return budget;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

const currentBudgetSlice = createSlice({
  name: "currentBudget",
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
