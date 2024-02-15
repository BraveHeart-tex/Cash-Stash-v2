import Dashboard from "../components/Dashboard";
import {
  fetchInsightsDataAction,
  getChartDataAction,
  getPaginatedAccountAction,
  getPaginatedBudgetsAction,
  searchTransactions,
} from "@/actions";
import { getGenericListByCurrentUser } from "@/actions/generic";
import { SerializedGoal } from "./redux/features/goalSlice";
import { SerializedReminder } from "./redux/features/remindersSlice";

export default async function Home() {
  let [
    result,
    accountsResult,
    insightsDataResult,
    monthlyTransactions,
    budgetsResult,
    goalsResult,
    remindersResult,
  ] = await Promise.all([
    searchTransactions({
      transactionType: "all",
      sortBy: "createdAt",
      sortDirection: "desc",
    }),
    getPaginatedAccountAction({ pageNumber: 1, query: "" }),
    fetchInsightsDataAction(),
    getChartDataAction(),
    getPaginatedBudgetsAction({ pageNumber: 1, query: "" }),
    getGenericListByCurrentUser<SerializedGoal>({
      tableName: "goal",
      serialize: true,
    }),
    getGenericListByCurrentUser<SerializedReminder>({
      tableName: "reminder",
      whereCondition: { isRead: false },
    }),
  ]);

  const { totalIncome, totalExpense, netIncome, savingsRate } =
    insightsDataResult;

  if (!totalIncome || !totalExpense || !netIncome || !savingsRate) {
    insightsDataResult = {
      totalIncome: 0,
      totalExpense: 0,
      netIncome: 0,
      savingsRate: "0",
    };
  }

  return (
    <main>
      <Dashboard
        budgets={budgetsResult.budgets}
        accounts={accountsResult?.accounts}
        monthlyTransactionsData={monthlyTransactions.data || []}
        insightsData={insightsDataResult}
        transactions={result?.transactions || []}
        goals={goalsResult?.data || []}
        reminders={remindersResult?.data || []}
      />
    </main>
  );
}
