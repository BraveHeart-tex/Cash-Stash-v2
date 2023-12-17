import NavigationTabs from "@/components/NavigationTabs";
import Dashboard from "./components/Dashboard";
import {
  fetchInsightsDataAction,
  getChartDataAction,
  searchTransactions,
} from "@/actions";

export default async function Home() {
  const result = await searchTransactions({
    transactionType: "all",
    sortBy: "createdAt",
    sortDirection: "desc",
  });
  let insightsDataResult = await fetchInsightsDataAction();
  let monthlyTransactions = await getChartDataAction();

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
        monthlyTransactionsData={monthlyTransactions.data || []}
        insightsData={insightsDataResult}
        transactions={result?.transactions || []}
      />
    </main>
  );
}
