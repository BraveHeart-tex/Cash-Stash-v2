"use client";
import {
  InsightsData,
  SerializedTransaction,
} from "@/app/redux/features/transactionsSlice";
import AccountSummaries from "./AccountSummaries";
import BudgetStatus from "./BudgetStatus";
import FinancialInsights from "./FinancialInsights";
import GoalStatus from "./GoalStatus";
import NotificationsAndReminders from "./NotificationAndReminders";
import TransactionHistory from "./TransactionHistory";
import BarChartComponent from "@/components/charts/BarChartComponent";
import { MonthlyData } from "./ReportsPage/ReportTable";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SerializedUserAccount } from "../redux/features/userAccountSlice";
import { SerializedBudget } from "../redux/features/budgetSlice";
import { SerializedGoal } from "../redux/features/goalSlice";
import { SerializedReminder } from "../redux/features/remindersSlice";
import { motion } from "framer-motion";

interface IDashboardProps {
  monthlyTransactionsData: MonthlyData["monthlyTransactionsData"];
  insightsData: InsightsData;
  transactions: SerializedTransaction[];
  accounts: SerializedUserAccount[];
  budgets: SerializedBudget[];
  goals: SerializedGoal[];
  reminders: SerializedReminder[];
}

const Dashboard = ({
  monthlyTransactionsData,
  transactions,
  insightsData,
  accounts,
  budgets,
  goals,
  reminders,
}: IDashboardProps) => {
  const sectionData = [
    {
      title: "Accounts Summary",
      description:
        "You can view your accounts here. Click on the account card to view the account details.",
      data: (
        <div className="max-h-[330px] min-h-[330px] lg:max-h-[350px] lg:min-h-[350px] overflow-y-scroll scrollbar-hide">
          <AccountSummaries accounts={accounts} />
        </div>
      ),
    },
    {
      title: "Budget Status",
      description:
        "You can check your budgets here. Click on the budget card to see details or create a new one using the menu button above.",
      data: (
        <div className="max-h-[300px] min-h-[300px] lg:max-h-[350px] lg:min-h-[350px] overflow-y-scroll scrollbar-hide">
          <BudgetStatus budgets={budgets} />
        </div>
      ),
    },
    {
      title: "Goal Progress",
      description:
        "Check your goals here. Click on a goal card to view or edit its details or create a new one by clicking the menu button above.",
      data: (
        <div className="max-h-[300px] min-h-[300px] lg:max-h-[350px] lg:min-h-[350px] overflow-y-scroll scrollbar-hide">
          <GoalStatus goals={goals} />
        </div>
      ),
    },
    {
      title: "Transaction History",
      description:
        "Check out your transaction history here. Click on the transaction card to view the transaction details.",
      data: <TransactionHistory transactions={transactions} />,
    },
    {
      title: "Financial Insights",
      description:
        "Get a comparison of your expenses vs income and other financial insights here.",
      data: (
        <div className="p-2 max-h-[500px] min-h-[500px] overflow-y-scroll scrollbar-hide flex flex-col gap-4 items-center justify-center">
          <BarChartComponent
            monthlyTransactionsData={monthlyTransactionsData}
          />
          <FinancialInsights insightsData={insightsData} />
        </div>
      ),
    },
    {
      title: "Notifications and Reminders",
      description: "View your notifications, set bill reminders here.",
      data: <NotificationsAndReminders reminders={reminders} />,
    },
  ];

  const dashboardVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={dashboardVariants}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="p-0 lg:p-1 lg.pt-0 mx-auto lg:max-w-[1300px] xl:max-w-[1600px]">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-8">
          {sectionData.map((section) => (
            <Card key={section.title}>
              <CardHeader className="font-[500] text-xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/40">
                {section.title}
                <span className="text-gray-500 text-sm">
                  {section.description}
                </span>
              </CardHeader>
              <CardContent>{section.data}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
