import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Transaction } from '@prisma/client';
import axios from 'axios';

interface TransactionState {
  filter: {
    type: 'income' | 'expense' | '';
    accountId: string;
  };
  createModalOpen: boolean;
  deleteModalOpen: boolean;
  transactionId: number;
  sort: {
    sortBy: string;
    sortDirection: 'asc' | 'desc';
  };
  data: Transaction[] | null;
  filteredData: Transaction[] | null;
  isLoading: boolean;
}

const initialState: TransactionState = {
  filter: {
    type: '',
    accountId: '',
  },
  createModalOpen: false,
  deleteModalOpen: false,
  transactionId: 0,
  sort: {
    sortBy: 'date',
    sortDirection: 'asc',
  },
  data: [],
  filteredData: null,
  isLoading: false,
};

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async () => {
    const response = await axios.get(`/api/user/transactions`);
    return response.data.transactions;
  }
);

const transactionsSlice = createSlice({
  name: 'filteredTransactions',
  initialState,
  reducers: {
    setFilterType: (state, action) => {
      state.filter.type = action.payload;
    },
    setFilterAccount: (state, action) => {
      state.filter.accountId = action.payload;
    },
    setSortBy: (state, action) => {
      state.sort.sortBy = action.payload;
    },
    setSortDirection: (state, action) => {
      state.sort.sortDirection = action.payload;
    },
    setCreateModalOpen: (state, action) => {
      state.createModalOpen = action.payload;
    },
    setDeleteModalOpen: (state, action) => {
      state.deleteModalOpen = action.payload.isDeleteModalOpen;
      state.transactionId = action.payload.transactionId;
    },
    updateFilteredData: (state) => {
      const { type, accountId } = state.filter;

      if (type === '' && accountId === '') {
        state.filteredData = state.data;
      } else {
        state.filteredData =
          state.data?.filter((transaction) => {
            if (type !== '') {
              if (
                (type === 'income' && !transaction.isIncome) ||
                (type === 'expense' && transaction.isIncome)
              ) {
                return false;
              }
            }
            if (
              accountId !== '' &&
              transaction.accountId !== parseInt(accountId)
            ) {
              return false;
            }
            return true;
          }) || null;
      }

      if (
        state.filteredData &&
        state.filteredData.length > 0 &&
        state.sort.sortBy
      ) {
        state.filteredData.sort((a, b) => {
          const aValue = a[state.sort.sortBy as keyof Transaction];
          const bValue = b[state.sort.sortBy as keyof Transaction];

          if (aValue < bValue) {
            return state.sort.sortDirection === 'asc' ? -1 : 1;
          }

          if (aValue > bValue) {
            return state.sort.sortDirection === 'desc' ? 1 : -1;
          }

          return 0;
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchTransactions.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {
  setFilterType,
  setFilterAccount,
  updateFilteredData,
  setSortBy,
  setSortDirection,
  setCreateModalOpen,
  setDeleteModalOpen,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;
