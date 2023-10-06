import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Goal } from "@prisma/client";
import { getGoalByIdAction } from "@/actions";

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
  async (goalId: number) => {
    try {
      const { goal, error } = await getGoalByIdAction(goalId);
      if (error || !goal) return null;

      return goal;
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
