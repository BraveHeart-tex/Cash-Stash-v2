import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Goal } from "@prisma/client";
import { getGoalsByCurrentUserAction } from "@/actions";

interface GoalsState {
  goals: Goal[] | null;
  isLoading: boolean;
  isEditGoalModalOpen: boolean;
  isCreateGoalModalOpen: boolean;
  isDeleteGoalModalOpen: boolean;
  selectedGoalId: number;
}

const initialState: GoalsState = {
  goals: null,
  isLoading: false,
  isEditGoalModalOpen: false,
  isCreateGoalModalOpen: false,
  isDeleteGoalModalOpen: false,
  selectedGoalId: 0,
};

export const fetchGoals = createAsyncThunk("goals/fetchGoals", async () => {
  const { goals } = await getGoalsByCurrentUserAction();
  return goals;
});

const goalsSlice = createSlice({
  name: "goals",
  initialState,
  reducers: {
    setEditGoalModalOpen: (state, action) => {
      state.isEditGoalModalOpen = action.payload.isEditGoalModalOpen;
      state.selectedGoalId = action.payload.selectedGoalId;
    },
    setCreateGoalModalOpen: (state, action) => {
      state.isCreateGoalModalOpen = action.payload;
    },
    setDeleteGoalModalOpen: (state, action) => {
      state.isDeleteGoalModalOpen = action.payload.isDeleteGoalModalOpen;
      state.selectedGoalId = action.payload.selectedGoalId;
    },
  },
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

export const {
  setEditGoalModalOpen,
  setCreateGoalModalOpen,
  setDeleteGoalModalOpen,
} = goalsSlice.actions;
export default goalsSlice.reducer;
