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
      data: (
        <div className="max-h-[330px] min-h-[330px] lg:max-h-[350px] lg:min-h-[350px] overflow-y-scroll scrollbar-hide">
          <AccountSummaries />
        </div>
      ),
    },
    {
      title: "Budget Status",
      data: (
        <div className="max-h-[300px] min-h-[300px] lg:max-h-[350px] lg:min-h-[350px] overflow-y-scroll scrollbar-hide">
          <BudgetStatus />
        </div>
      ),
    },
    {
      title: "Goal Progress",
      data: (
        <div className="max-h-[300px] min-h-[300px] lg:max-h-[350px] lg:min-h-[350px] overflow-y-scroll scrollbar-hide">
          <GoalStatus />
        </div>
      ),
    },
    {
      title: "Transaction History",
      data: <TransactionHistory transactions={transactions} />,
    },
    {
      title: "Financial Insights",
      data: (
        <div className="p-2 max-h-[500px] min-h-[500px] overflow-y-scroll scrollbar-hide">
          <p className="font-bold underline text-foreground">
            Income vs Expense
          </p>

          <BarChartComponent
            monthlyTransactionsData={monthlyTransactionsData}
          />
          <FinancialInsights insightsData={insightsData} />
        </div>
      ),
    },
    {
      title: "Notifications and Reminders",
      data: <NotificationsAndReminders />,
    },
  ];

  return (
    <div className="p-4 pt-0 mx-auto lg:max-w-[1300px] xl:max-w-[1600px]">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-8">
        {sectionData.map((section) => (
          <Card key={section.title}>
            <CardHeader className="font-[500] text-xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/40">
              {section.title}
            </CardHeader>
            <CardContent>{section.data}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
