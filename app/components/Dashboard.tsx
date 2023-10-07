"use client";
import {
  fetchInsightsData,
  fetchMonthlyTransactionsData,
  fetchTransactions,
} from "@/app/redux/features/transactionsSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { useEffect } from "react";
import AccountSummaries from "./AccountSummaries";
import BudgetStatus from "./BudgetStatus";
import FinancialInsights from "./FinancialInsights";
import GoalStatus from "./GoalStatus";
import NotificationsAndReminders from "./NotificationAndReminders";
import TransactionHistory from "./TransactionHistory";
import BarChartComponent from "@/components/charts/BarChartComponent";
import { MonthlyData } from "./ReportsPage/ReportTable";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  showDefaultToast,
  showErrorToast,
  showSuccessToast,
} from "@/components/ui/use-toast";

interface IDashboardProps {
  monthlyTransactionsData: MonthlyData["monthlyTransactionsData"];
}

const Dashboard = ({ monthlyTransactionsData }: IDashboardProps) => {
  const dispatch = useAppDispatch();
  const { data: transactions, insightsData } = useAppSelector(
    (state) => state.transactionsReducer
  );

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchMonthlyTransactionsData());
    dispatch(fetchInsightsData());
  }, [dispatch]);

  const sectionData = [
    {
      title: "Accounts Summary",
      description:
        "You can view your accounts here. Click on the account card to view the account details.",
      data: (
        <div className="max-h-[330px] min-h-[330px] lg:max-h-[350px] lg:min-h-[350px] overflow-y-scroll scrollbar-hide">
          <AccountSummaries />
        </div>
      ),
    },
    {
      title: "Budget Status",
      description:
        "You can check your budgets here. Click on the budget card to see details or create a new one using the menu button above.",
      data: (
        <div className="max-h-[300px] min-h-[300px] lg:max-h-[350px] lg:min-h-[350px] overflow-y-scroll scrollbar-hide">
          <BudgetStatus />
        </div>
      ),
    },
    {
      title: "Goal Progress",
      description:
        "Check your goals here. Click on a goal card to view or edit its details or create a new one by clicking the menu button above.",
      data: (
        <div className="max-h-[300px] min-h-[300px] lg:max-h-[350px] lg:min-h-[350px] overflow-y-scroll scrollbar-hide">
          <GoalStatus />
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
        <div className="p-2 max-h-[500px] min-h-[500px] overflow-y-scroll scrollbar-hide flex items-center justify-center">
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
      data: <NotificationsAndReminders />,
    },
  ];

  return (
    <div className="p-1 pt-0 mx-auto lg:max-w-[1300px] xl:max-w-[1600px]">
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
        <Button
          onClick={() =>
            showDefaultToast("default toast", "default toast message")
          }
        >
          Default
        </Button>
        <Button
          onClick={() => showErrorToast("error toast", "show error toast")}
        >
          Error
        </Button>
        <Button
          onClick={() =>
            showSuccessToast("success toast", "show success toast")
          }
        >
          Success
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
