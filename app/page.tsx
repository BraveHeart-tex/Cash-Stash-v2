import NavigationTabs from "@/components/NavigationTabs";
import Dashboard from "./components/Dashboard";
import {
  fetchInsightsDataAction,
  getChartDataAction,
  searchTransactions,
} from "@/actions";
import { getGenericListByCurrentUser } from "@/actions/generic";
import { SerializedUserAccount } from "./redux/features/userAccountSlice";

export default async function Home() {
  let [result, accountsResult, insightsDataResult, monthlyTransactions] =
    await Promise.all([
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
        accounts={accountsResult?.data || []}
        monthlyTransactionsData={monthlyTransactions.data || []}
        insightsData={insightsDataResult}
        transactions={result?.transactions || []}
      />
    </main>
  );
}
