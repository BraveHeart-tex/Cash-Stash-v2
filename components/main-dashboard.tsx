import AccountSummaries from "@/components/account-summaries";
import BudgetStatus from "@/components/budget-status";
import FinancialInsights from "@/components/financial-insights";
import GoalStatus from "@/components/goals/goal-status";
import NotificationsAndReminders from "@/components/notification-and-reminders";
import TransactionHistory from "@/components/transaction-history";
import BarChartComponent from "@/components/charts/bar-chart";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import MotionDiv from "@/components/animations/motion-div";
import { getPaginatedTransactions } from "@/server/transaction";
import { getPaginatedAccounts } from "@/server/account";
import { fetchInsightsDataAction, getChartData } from "@/server";
import { getPaginatedBudgets } from "@/server/budget";
import { getPaginatedGoals } from "@/server/goal";
import { getPaginatedReminders } from "@/server/reminder";

const Dashboard = async () => {
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
      title: "Accounts Summary",
      description:
        "Access your accounts here. Navigate to the 'Accounts' page to see a comprehensive list of all your accounts.",
      data: (
        <article className="max-h-[330px] min-h-[330px] lg:max-h-[350px] lg:min-h-[350px] overflow-y-auto">
          <AccountSummaries accounts={accountsResult.accounts} />
        </article>
      ),
    },
    {
      title: "Budget Status",
      description:
        "Explore your budgets here. Simply click on a budget card to view its details or create a new one using the menu button above.",
      data: (
        <article className="max-h-[300px] min-h-[300px] lg:max-h-[350px] lg:min-h-[350px] overflow-y-auto">
          <BudgetStatus budgets={budgetsResult.budgets} />
        </article>
      ),
    },
    {
      title: "Goal Progress",
      description:
        "Explore your goals here. Simply click on a goal card to view or edit its details, or create a new one by clicking the menu button above.",
      data: (
        <article className="max-h-[300px] min-h-[300px] lg:max-h-[350px] lg:min-h-[350px] overflow-y-auto">
          <GoalStatus goals={goalsResult.goals} />
        </article>
      ),
    },
    {
      title: "Latest Transactions",
      description: "Explore your latest transactions here.",
      data: (
        <TransactionHistory transactions={transactionsResult.transactions} />
      ),
    },
    {
      title: "Financial Insights",
      description:
        "View a breakdown of your spending versus earnings for this month, along with additional financial insights.",
      data: (
        <article className="p-2 max-h-[500px] min-h-[500px] overflow-y-auto flex flex-col gap-4 items-center justify-center scrollbar-hide">
          <BarChartComponent
            monthlyTransactionsData={monthlyTransactions.data || []}
          />
          <FinancialInsights insightsData={insightsDataResult} />
        </article>
      ),
    },
    {
      title: "Notifications and Reminders",
      description: "View your notifications, and reminders here.",
      data: <NotificationsAndReminders reminders={remindersResult.reminders} />,
    },
  ];

  const dashboardVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <MotionDiv
      initial="hidden"
      animate="visible"
      variants={dashboardVariants}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="p-0 lg:p-1 lg.pt-0 mx-auto lg:max-w-[1300px] xl:max-w-[1600px]">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sectionData.map((section) => (
            <Card key={section.title}>
              <CardHeader className="font-[500] text-xl text-primary">
                {section.title}
                <span className="text-muted-foreground text-sm">
                  {section.description}
                </span>
              </CardHeader>
              <CardContent>{section.data}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MotionDiv>
  );
};

export default Dashboard;
