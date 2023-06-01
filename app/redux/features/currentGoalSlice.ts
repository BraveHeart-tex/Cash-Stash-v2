import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Goal } from '@prisma/client';
import axios from 'axios';

interface CurrentGoalState {
  currentGoal: Goal | null;
  isLoading: boolean;
}

const initialState: CurrentGoalState = {
  currentGoal: null,
  isLoading: false,
};

interface FetchCurrentGoalResponse {
  goal: Goal;
}

export const fetchGoalById = createAsyncThunk(
  'goals/fetchGoalById',
  async (goalId: string) => {
    try {
      const response = await axios.get<FetchCurrentGoalResponse>(
        `/api/user/goals/${goalId}`
      );
      return response.data.goal;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

const currentGoalSlice = createSlice({
  name: 'currentGoal',
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
