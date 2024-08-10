import AccountSummaries from "@/components/account-summaries";
import BudgetStatus from "@/components/budget-status";
import BarChartComponent from "@/components/charts/bar-chart";
import FinancialInsights from "@/components/financial-insights";
import GoalStatus from "@/components/goals/goal-status";
import NotificationsAndReminders from "@/components/notification-and-reminders";
import TransactionHistory from "@/components/transaction-history";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchInsightsDataAction, getChartData } from "@/server";
import { getPaginatedAccounts } from "@/server/account";
import { getPaginatedBudgets } from "@/server/budget";
import { getPaginatedGoals } from "@/server/goal";
import { getPaginatedReminders } from "@/server/reminder";
import { getPaginatedTransactions } from "@/server/transaction";
import { getTranslations } from "next-intl/server";

const Dashboard = async () => {
  const t = await getTranslations("Dashboard");
  // TODO: Write custom function to fetch dashboard-related data
  let [
    transactionsResult,
    accountsResult,
    insightsDataResult,
    monthlyTransactions,
    budgetsResult,
    goalsResult,
    remindersResult,
  ] = await Promise.all([
    getPaginatedTransactions({
      sortBy: "createdAt",
      pageNumber: 1,
      query: "",
    }),
    getPaginatedAccounts({ pageNumber: 1, query: "" }),
    fetchInsightsDataAction(),
    getChartData(),
    getPaginatedBudgets({ pageNumber: 1, query: "" }),
    getPaginatedGoals({ pageNumber: 1, query: "" }),
    // Reminders
    getPaginatedReminders({
      query: "",
      pageNumber: 1,
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

  const sectionData = [
    {
      title: t("accountsSummaryTitle"),
      description: t("accountsSummaryDescription"),
      data: (
        <article className="max-h-[330px] min-h-[330px] overflow-y-auto overflow-x-hidden lg:max-h-[350px] lg:min-h-[350px]">
          <AccountSummaries accounts={accountsResult.accounts} />
        </article>
      ),
    },
    {
      title: t("budgetsSummaryTitle"),
      description: t("budgetsSummaryDescription"),
      data: (
        <article className="max-h-[300px] min-h-[300px] overflow-y-auto lg:max-h-[350px] lg:min-h-[350px]">
          <BudgetStatus budgets={budgetsResult.budgets} />
        </article>
      ),
    },
    {
      title: t("goalSummaryTitle"),
      description: t("goalSummaryDescription"),
      data: (
        <article className="max-h-[300px] min-h-[300px] overflow-y-auto lg:max-h-[350px] lg:min-h-[350px]">
          <GoalStatus goals={goalsResult.goals} />
        </article>
      ),
    },
    {
      title: t("transactionSummaryTitle"),
      description: t("transactionSummaryDescription"),
      data: (
        <TransactionHistory transactions={transactionsResult.transactions} />
      ),
    },
    {
      title: t("financialInsightsTitle"),
      description: t("financialInsightsDescription"),
      data: (
        <article className="scrollbar-hide flex max-h-[500px] min-h-[500px] flex-col items-center justify-center gap-4 overflow-y-auto p-2">
          <BarChartComponent
            monthlyTransactionsData={monthlyTransactions.data || []}
          />
          <FinancialInsights insightsData={insightsDataResult} />
        </article>
      ),
    },
    {
      title: t("notificationsAndRemindersTitle"),
      description: t("notificationsAndRemindersDescription"),
      data: <NotificationsAndReminders reminders={remindersResult.reminders} />,
    },
  ];

  return (
    <div className="mx-auto p-0 lg:max-w-[1300px] lg:p-1 lg:pt-0 xl:max-w-[1600px]">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {sectionData.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle className="text-lg text-primary">
                {section.title}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {section.description}
              </CardDescription>
            </CardHeader>
            <CardContent>{section.data}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
