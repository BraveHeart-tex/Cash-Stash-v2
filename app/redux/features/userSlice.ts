import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '@prisma/client';
import axios from 'axios';

interface UserState {
  currentUser: User | null;
  isLoading: boolean;
}

const initialState: UserState = {
  currentUser: null,
  isLoading: false,
};

export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrentUser',
  async () => {
    const response = await axios.get(`/api/user`);
    return response.data.user;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default userSlice.reducer;
