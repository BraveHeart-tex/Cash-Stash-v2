import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { UserAccount } from '@prisma/client';
import axios from 'axios';

interface UserAccountsState {
  currentAccount: UserAccount | null;
  isLoading: boolean;
}

const initialState: UserAccountsState = {
  currentAccount: null,
  isLoading: false,
};

interface FetchCurrentAccountResponse {
  account: UserAccount;
}

export const fetchCurrentAccount = createAsyncThunk(
  'currentAccount/fetchCurrentAccount',
  async (id: string | null) => {
    try {
      const response = await axios.get<FetchCurrentAccountResponse>(
        `/api/user/accounts/${id}`
      );
      return response.data.account;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

const accountSlice = createSlice({
  name: 'currentAccount',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentAccount.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCurrentAccount.fulfilled, (state, action) => {
        state.currentAccount = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchCurrentAccount.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default accountSlice.reducer;
