import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { IGetPaginatedAccountsParams } from "@/actions/types";
import { getPaginatedAccounts } from "@/actions/account";
import { SerializedUserAccount } from "@/actions/types";

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
  async ({ pageNumber, query }: IGetPaginatedAccountsParams) => {
    const result = await getPaginatedAccounts({ pageNumber, query });

    const mappedAccounts = result.accounts.map((data) => ({
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
