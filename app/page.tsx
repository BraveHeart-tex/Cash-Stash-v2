import NavigationTabs from "@/components/NavigationTabs";
import Dashboard from "./components/Dashboard";
import {
  fetchInsightsDataAction,
  getChartDataAction,
  searchTransactions,
} from "@/actions";
import { getGenericListByCurrentUser } from "@/actions/generic";
import { SerializedUserAccount } from "./redux/features/userAccountSlice";
import { SerializedBudget } from "./redux/features/budgetSlice";
import { SerializedGoal } from "./redux/features/goalSlice";

export default async function Home() {
  let [
    result,
    accountsResult,
    insightsDataResult,
    monthlyTransactions,
    budgetsResult,
    goalsResult,
  ] = await Promise.all([
    searchTransactions({
      transactionType: "all",
      sortBy: "createdAt",
      sortDirection: "desc",
    }),
    getGenericListByCurrentUser<SerializedUserAccount>({
      tableName: "userAccount",
      serialize: true,
    }),
    fetchInsightsDataAction(),
    getChartDataAction(),
    getGenericListByCurrentUser<SerializedBudget>({
      tableName: "budget",
      serialize: true,
    }),
    getGenericListByCurrentUser<SerializedGoal>({
      tableName: "goal",
      serialize: true,
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
      {/* @ts-expect-error */}
      <NavigationTabs />
      <Dashboard
        budgets={budgetsResult?.data || []}
        accounts={accountsResult?.data || []}
        monthlyTransactionsData={monthlyTransactions.data || []}
        insightsData={insightsDataResult}
        transactions={result?.transactions || []}
        goals={goalsResult?.data || []}
      />
    </main>
  );
}
