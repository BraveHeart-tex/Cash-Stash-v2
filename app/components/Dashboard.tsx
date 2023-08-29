"use client";
import AccountSummaries from "./AccountSummaries";
import BudgetStatus from "./BudgetStatus";
import GoalStatus from "./GoalStatus";
import TransactionHistory from "./TransactionHistory";
import FinancialInsights from "./FinancialInsights";
import NotificationsAndReminders from "./NotificationAndReminders";
import InsightGroupChart from "./DashboardPage/InsightGroupChart";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useEffect } from "react";
import {
  fetchInsightsData,
  fetchMonthlyTransactionsData,
  fetchTransactions,
} from "../redux/features/transactionsSlice";
import CreateReminderModal from "./Reminders/modals/CreateReminderModal";
import EditReminderModal from "./Reminders/modals/EditReminderModal";
import Navigation from "./Navigation";
import Spinner from "@/components/Spinner";

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
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchMonthlyTransactionsData());
  }, [dispatch]);

  useEffect(() => {
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
      data: <AccountSummaries />,
    },
    {
      title: "Budget Status",
      data: <BudgetStatus />,
    },
    {
      title: "Goal Progress",
      data: <GoalStatus />,
    },
    {
      title: "Transaction History",
      data: <TransactionHistory transactions={transactions} />,
    },
    {
      title: "Financial Insights",
      data: (
        <div>
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
      data: (
        <div>
          <NotificationsAndReminders />
          <CreateReminderModal />
          <EditReminderModal />
        </div>
      ),
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
