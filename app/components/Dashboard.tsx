"use client";
import {
  fetchInsightsData,
  fetchMonthlyTransactionsData,
  fetchTransactions,
} from "@/app/redux/features/transactionsSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import Spinner from "@/components/Spinner";
import { useEffect } from "react";
import AccountSummaries from "./AccountSummaries";
import BudgetStatus from "./BudgetStatus";
import InsightGroupChart from "./DashboardPage/InsightGroupChart";
import FinancialInsights from "./FinancialInsights";
import GoalStatus from "./GoalStatus";
import Navigation from "./Navigation";
import NotificationsAndReminders from "./NotificationAndReminders";
import TransactionHistory from "./TransactionHistory";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const {
    isLoading,
    data: transactions,
    monthlyData,
    insightsData,
  } = useAppSelector((state) => state.transactionsReducer);

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchMonthlyTransactionsData());
    dispatch(fetchInsightsData());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="bg-background min-h-screen flex justify-center items-center flex-col gap-4">
        <h2 className="font-bold text-foreground text-4xl">Loading...</h2>
        <div>
          <Spinner />
        </div>
      </div>
    );
  }

  const sectionData = [
    {
      title: "Accounts Summary",
      data: (
        <div className="min-h-[300px] lg:min-h-[350px] overflow-y-scroll scrollbar-hide">
          <AccountSummaries />
        </div>
      ),
    },
    {
      title: "Budget Status",
      data: (
        <div className="min-h-[300px] lg:min-h-[350px] overflow-y-scroll scrollbar-hide">
          <BudgetStatus />
        </div>
      ),
    },
    {
      title: "Goal Progress",
      data: (
        <div className="min-h-[300px] lg:min-h-[350px] overflow-y-scroll scrollbar-hide">
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
        <div className="p-2 min-h-[500px] max-h-[500px] overflow-y-scroll scrollbar-hide">
          <p className="font-bold underline text-foreground">
            Income vs Expense
          </p>
          <InsightGroupChart monthlyData={monthlyData} />
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
    <div className="p-4 mx-auto lg:max-w-[1300px] xl:max-w-[1600px]">
      <Navigation />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-8">
        {sectionData.map((section) => (
          <div key={section.title}>
            <h3 className="text-xl mb-2 font-bold">{section.title}</h3>
            <div className="p-4 rounded-lg shadow-sm bg-secondary">
              {section.data}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
