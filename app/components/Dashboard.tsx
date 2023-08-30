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
import CreateReminderModal from "./Reminders/modals/CreateReminderModal";
import EditReminderModal from "./Reminders/modals/EditReminderModal";
import TransactionHistory from "./TransactionHistory";
import { Button } from "@/components/ui/button";
import { showGenericConfirm } from "../redux/features/genericConfirmSlice";
import { getCurrentUserAction } from "@/actions";

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
        <div className="p-2 h-[700px] overflow-y-scroll scrollbar-hide">
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

  const handleShowGenericConfirm = () => {
    dispatch(
      showGenericConfirm({
        title: "Test",
        message: "Test",
        primaryActionLabel: "Test",
        primaryAction: async () => await getCurrentUserAction(),
        resolveCallback(result) {
          console.log(result);
        },
      })
    );
  };

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
      <Button onClick={() => handleShowGenericConfirm()}>
        Generic Confirm Test
      </Button>
    </div>
  );
};

export default Dashboard;
