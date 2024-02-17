import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UserAccount } from "@prisma/client";
import { getGeneric } from "@/actions/generic";

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
  async (id: string | null) => {
    if (!id) {
      return null;
    }
    const result = await getGeneric<UserAccount>({
      tableName: "userAccount",
      whereCondition: { id },
    });
    if (result?.error || !result?.data) {
      return null;
    }
    return result.data;
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
