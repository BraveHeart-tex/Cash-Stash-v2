import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Transaction, UserAccount } from "@prisma/client";
import {
  fetchInsightsDataAction,
  fetchMonthlyTransactionsDataAction,
  getChartDataAction,
} from "@/actions";
import { MonthlyData } from "@/app/components/ReportsPage/ReportTable";
import { getGenericListByCurrentUser } from "@/actions/generic";

export type SerializedTransaction = Omit<Transaction, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
  account?: Partial<UserAccount>;
};

export interface InsightsData {
  totalIncome: number;
  totalExpense: number;
  netIncome: number;
  savingsRate: string;
}

interface Income {
  month: string;
  amount: number;
}

interface Expense {
  month: string;
  amount: number;
}

export interface MonthlyTransactionData {
  incomes: Income[];
  expenses: Expense[];
}

interface TransactionState {
  filter: {
    type: "income" | "expense" | "";
    accountId: string;
  };
  sort: {
    sortBy: string;
    sortDirection: "asc" | "desc";
  };
  data: SerializedTransaction[] | null;
  filteredData: SerializedTransaction[] | null;
  monthlyData: MonthlyTransactionData | null;
  insightsData: InsightsData | null;
  topTransactionsByCategory: MonthlyData["monthlyTransactionsData"] | null;
  isLoading: boolean;
}

const initialState: TransactionState = {
  filter: {
    type: "",
    accountId: "",
  },
  sort: {
    sortBy: "date",
    sortDirection: "asc",
  },
  data: [],
  filteredData: null,
  topTransactionsByCategory: null,
  insightsData: null,
  monthlyData: null,
  isLoading: false,
};

export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async () => {
    const result = await getGenericListByCurrentUser<Transaction>({
      tableName: "transaction",
    });

    if (result?.error || !result || !result.data) {
      return null;
    }

    const transactions = result.data;

    return transactions.map((data) => ({
      ...data,
      createdAt: new Date(data.createdAt).toLocaleDateString(),
      updatedAt: new Date(data.updatedAt).toLocaleDateString(),
    }));
  }
);

export const getChartData = createAsyncThunk(
  "transactions/getChartData",
  async () => {
    const chartData = await getChartDataAction();
    if (chartData.error) {
      return null;
    } else {
      return chartData.data;
    }
  }
);

export const fetchMonthlyTransactionsData = createAsyncThunk(
  "transactions/fetchMonthlyTransactionsData",
  async () => {
    const { incomes, expenses } = await fetchMonthlyTransactionsDataAction();
    if (!incomes?.length || !expenses?.length) {
      return {
        error: "No data found.",
      };
    }
    return { incomes, expenses };
  }
);

export const fetchInsightsData = createAsyncThunk(
  "transactions/fetchInsightsData",
  async () => {
    const { totalIncome, totalExpense, netIncome, savingsRate } =
      await fetchInsightsDataAction();

    if (!totalIncome || !totalExpense || !netIncome || !savingsRate) {
      return {
        totalIncome: 0,
        totalExpense: 0,
        netIncome: 0,
        savingsRate: "0",
      };
    }

    return {
      totalIncome,
      totalExpense,
      netIncome,
      savingsRate,
    };
  }
);

const transactionsSlice = createSlice({
  name: "filteredTransactions",
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
    updateFilteredData: (state) => {
      const { type, accountId } = state.filter;

      if (type === "" && accountId === "") {
        state.filteredData = state.data;
      } else {
        state.filteredData =
          state.data?.filter((transaction) => {
            if (type !== "") {
              if (
                (type === "income" && !transaction.isIncome) ||
                (type === "expense" && transaction.isIncome)
              ) {
                return false;
              }
            }
            if (accountId !== "" && transaction.accountId !== accountId) {
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
            return state.sort.sortDirection === "asc" ? 1 : -1;
          }

          if (aValue > bValue) {
            return state.sort.sortDirection === "desc" ? -1 : 1;
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
        if (action.payload === undefined) {
          state.isLoading = false;
          return;
        }
        state.data = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchTransactions.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchMonthlyTransactionsData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMonthlyTransactionsData.fulfilled, (state, action) => {
        if (action.payload === undefined) {
          state.isLoading = false;
          return;
        }

        const { incomes, expenses } = action.payload;

        if (!incomes?.length || !expenses?.length) {
          state.isLoading = false;
          return;
        }

        state.monthlyData = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchMonthlyTransactionsData.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getChartData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getChartData.fulfilled, (state, action) => {
        if (!action.payload) {
          state.isLoading = false;
          return;
        }
        state.topTransactionsByCategory = action.payload;
        state.isLoading = false;
      })
      .addCase(getChartData.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchInsightsData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchInsightsData.fulfilled, (state, action) => {
        if (action.payload === undefined) {
          state.isLoading = false;
          return;
        }
        state.insightsData = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchInsightsData.rejected, (state) => {
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
} = transactionsSlice.actions;

export default transactionsSlice.reducer;
