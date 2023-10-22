import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Goal } from "@prisma/client";
import { getGeneric } from "@/actions/generic";

interface CurrentGoalState {
  currentGoal: Goal | null;
  isLoading: boolean;
}

const initialState: CurrentGoalState = {
  currentGoal: null,
  isLoading: false,
};

export const fetchGoalById = createAsyncThunk(
  "goals/fetchGoalById",
  async (goalId: string) => {
    try {
      const result = await getGeneric<Goal>({
        tableName: "goal",
        whereCondition: { id: goalId },
      });

      if (result?.error || !result?.data) return null;

      return result.data;
    } catch (error) {
      throw error;
    }
  }
);

const currentGoalSlice = createSlice({
  name: "currentGoal",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoalById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchGoalById.fulfilled, (state, action) => {
        state.currentGoal = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchGoalById.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default currentGoalSlice.reducer;
