import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Goal } from "@prisma/client";
import { getGenericListByCurrentUser } from "@/actions/generic";

export type SerializedGoal = Omit<Goal, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

interface GoalsState {
  goals: SerializedGoal[] | null;
  isLoading: boolean;
}

const initialState: GoalsState = {
  goals: null,
  isLoading: false,
};

export const fetchGoals = createAsyncThunk("goals/fetchGoals", async () => {
  const result = await getGenericListByCurrentUser<Goal>({
    tableName: "goal",
  });

  if (result?.error || !result || !result.data) {
    return null;
  }

  const goals = result.data;

  const mappedGoals = goals.map((data) => ({
    ...data,
    createdAt: new Date(data.createdAt).toLocaleDateString(),
    updatedAt: new Date(data.updatedAt).toLocaleDateString(),
  }));

  return mappedGoals;
});

const goalsSlice = createSlice({
  name: "goals",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoals.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        if (action.payload === undefined) {
          state.isLoading = false;
          return;
        }
        state.goals = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchGoals.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default goalsSlice.reducer;
