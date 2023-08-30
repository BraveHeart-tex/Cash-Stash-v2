import { getAccountByIdAction } from "@/actions/index";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UserAccount } from "@prisma/client";

interface UserAccountsState {
  currentAccount: UserAccount | null;
  isLoading: boolean;
}

const initialState: UserAccountsState = {
  currentAccount: null,
  isLoading: false,
};

export const fetchCurrentAccount = createAsyncThunk(
  "currentAccount/fetchCurrentAccount",
  async (id: number | null) => {
    if (!id) {
      return null;
    }
    const { account } = await getAccountByIdAction(id);
    return account;
  }
);

const accountSlice = createSlice({
  name: "currentAccount",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentAccount.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCurrentAccount.fulfilled, (state, action) => {
        if (!action.payload) {
          state.currentAccount = null;
          state.isLoading = false;
          return;
        }
        state.currentAccount = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchCurrentAccount.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default accountSlice.reducer;
