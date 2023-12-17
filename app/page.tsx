import NavigationTabs from "@/components/NavigationTabs";
import Dashboard from "./components/Dashboard";
import { getGenericListByCurrentUser } from "@/actions/generic";
import { SerializedTransaction } from "./redux/features/transactionsSlice";
import { fetchInsightsDataAction, getChartDataAction } from "@/actions";

export default async function Home() {
  const result = await getGenericListByCurrentUser<SerializedTransaction>({
    tableName: "transaction",
    serialize: true,
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
        transactions={result?.data || []}
      />
    </main>
  );
}
