import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { UserAccount } from '@prisma/client';
import axios from 'axios';

interface UserAccountsState {
  currentUserAccounts: UserAccount[] | null;
  isLoading: boolean;
  isCreateAccountModalOpen: boolean;
  isEditAccountModalOpen: boolean;
  isDeleteAccountModalOpen: boolean;
  selectedUserAccountId: number;
}

const initialState: UserAccountsState = {
  currentUserAccounts: null,
  isLoading: false,
  isCreateAccountModalOpen: false,
  isEditAccountModalOpen: false,
  isDeleteAccountModalOpen: false,
  selectedUserAccountId: 0,
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
  reducers: {
    setIsCreateAccountModalOpen(state, action) {
      state.isCreateAccountModalOpen = action.payload;
    },
    setIsEditAccountModalOpen(state, action) {
      state.isEditAccountModalOpen = action.payload.isEditAccountModalOpen;
      state.selectedUserAccountId = action.payload.selectedUserAccountId;
    },
    setIsDeleteAccountModalOpen(state, action) {
      state.isDeleteAccountModalOpen = action.payload.isDeleteAccountModalOpen;
      state.selectedUserAccountId = action.payload.selectedUserAccountId;
    },
  },
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

export const {
  setIsCreateAccountModalOpen,
  setIsEditAccountModalOpen,
  setIsDeleteAccountModalOpen,
} = accountSlice.actions;
export default accountSlice.reducer;
