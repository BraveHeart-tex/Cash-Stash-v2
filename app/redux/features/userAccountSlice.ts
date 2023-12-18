import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UserAccount } from "@prisma/client";
import { getGenericListByCurrentUser } from "@/actions/generic";

export type SerializedUserAccount = Omit<UserAccount, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

interface UserAccountsState {
  currentUserAccounts: SerializedUserAccount[] | null;
  isLoading: boolean;
}

const initialState: UserAccountsState = {
  currentUserAccounts: null,
  isLoading: false,
};

export const fetchCurrentUserAccounts = createAsyncThunk(
  "accounts/fetchCurrentUserAccounts",
  async () => {
    const result = await getGenericListByCurrentUser<UserAccount>({
      tableName: "userAccount",
    });

    if (result?.error || !result || !result.data) {
      return null;
    }

    const accounts = result.data;

    const mappedAccounts = accounts.map((data) => ({
      ...data,
      createdAt: new Date(data.createdAt).toLocaleDateString(),
      updatedAt: new Date(data.updatedAt).toLocaleDateString(),
    }));

    return mappedAccounts;
  }
);

const accountSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUserAccounts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCurrentUserAccounts.fulfilled, (state, action) => {
        if (action.payload === undefined) {
          state.isLoading = false;
          return;
        }

        state.currentUserAccounts = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchCurrentUserAccounts.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default accountSlice.reducer;
