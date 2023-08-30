import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UserAccount } from "@prisma/client";
import { getAccountsByCurrentUserAction } from "@/actions";

export type SerializedUserAccount = Omit<
  UserAccount,
  "createdAt" | "updatedAt"
> & {
  createdAt: string;
};

interface UserAccountsState {
  currentUserAccounts: SerializedUserAccount[] | null;
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
  "accounts/fetchCurrentUserAccounts",
  async () => {
    const { accounts } = await getAccountsByCurrentUserAction();

    if (!accounts) {
      return undefined;
    }

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

export const {
  setIsCreateAccountModalOpen,
  setIsEditAccountModalOpen,
  setIsDeleteAccountModalOpen,
} = accountSlice.actions;
export default accountSlice.reducer;
