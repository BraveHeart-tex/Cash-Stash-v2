import Dashboard from "@/components/main-dashboard";
import { fetchInsightsDataAction, getChartData } from "@/actions";
import { getPaginatedTransactions } from "@/actions/transaction";
import { getPaginatedAccounts } from "@/actions/account";
import { getPaginatedBudgets } from "@/actions/budget";
import { getPaginatedGoals } from "@/actions/goal";
import { getGenericListByCurrentUser } from "@/actions/generic";
import { SerializedReminder } from "@/actions/types";
import DashboardSkeleton from "@/components/dashboard-skeleton";
import { Suspense } from "react";
import { getUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  let [
    result,
    accountsResult,
    insightsDataResult,
    monthlyTransactions,
    budgetsResult,
    goalsResult,
    remindersResult,
  ] = await Promise.all([
    getPaginatedTransactions({
      transactionType: "all",
      sortBy: "createdAt",
      sortDirection: "desc",
    }),
    getPaginatedAccounts({ pageNumber: 1, query: "" }),
    fetchInsightsDataAction(),
    getChartData(),
    getPaginatedBudgets({ pageNumber: 1, query: "" }),
    getPaginatedGoals({ pageNumber: 1, query: "" }),
    getGenericListByCurrentUser<SerializedReminder>({
      tableName: "reminder",
      whereCondition: { markedAsReadAt: null },
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
      <Suspense fallback={<DashboardSkeleton />}>
        <Dashboard
          budgets={budgetsResult.budgets}
          accounts={accountsResult?.accounts}
          monthlyTransactionsData={monthlyTransactions.data || []}
          insightsData={insightsDataResult}
          transactions={[]}
          goals={goalsResult.goals}
          reminders={remindersResult?.data || []}
        />
      </Suspense>
    </main>
  );
}
