import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Budget } from "@prisma/client";
import { getGenericListByCurrentUser } from "@/actions/generic";

export type SerializedBudget = Omit<Budget, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

interface BudgetsState {
  budgets: SerializedBudget[] | null;
  isLoading: boolean;
}

const initialState: BudgetsState = {
  budgets: null,
  isLoading: false,
};

export const fetchBudgets = createAsyncThunk(
  "budgets/fetchBudgets",
  async () => {
    const result = await getGenericListByCurrentUser<Budget>({
      tableName: "budget",
    });

    if (result?.error || !result || !result.data) {
      return null;
    }

    const budgets = result.data;

    const mappedBudgets = budgets.map((data) => ({
      ...data,
      createdAt: new Date(data.createdAt).toLocaleDateString(),
      updatedAt: new Date(data.updatedAt).toLocaleDateString(),
    }));

    return mappedBudgets;
  }
);

const budgetSlice = createSlice({
  name: "budgets",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudgets.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        if (action.payload === undefined) {
          state.isLoading = false;
          return;
        }

        state.budgets = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchBudgets.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default budgetSlice.reducer;
