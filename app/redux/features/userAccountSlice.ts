import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { UserAccount } from '@prisma/client';
import axios from 'axios';

interface UserAccountsState {
  currentUserAccounts: UserAccount[] | null;
  isLoading: boolean;
}

const initialState: UserAccountsState = {
  currentUserAccounts: null,
  isLoading: false,
};

export const fetchCurrentUserAccounts = createAsyncThunk(
  'accounts/fetchCurrentUserAccounts',
  async () => {
    const response = await axios.get(`/api/user/accounts`);
    return response.data.currentAccounts;
  }
);

const accountSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUserAccounts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCurrentUserAccounts.fulfilled, (state, action) => {
        state.currentUserAccounts = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchCurrentUserAccounts.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default accountSlice.reducer;
