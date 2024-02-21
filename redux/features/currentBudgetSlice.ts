import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Budget } from "@prisma/client";
import { getGeneric } from "@/actions/generic";

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
  async (budgetId: string) => {
    try {
      const result = await getGeneric<Budget>({
        tableName: "budget",
        whereCondition: { id: budgetId },
      });

      if (result?.error || !result?.data) {
        return null;
      }

      return result.data;
    } catch (error) {
      console.error(error);
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
