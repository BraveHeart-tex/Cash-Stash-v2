import { createElement } from "react";
import AccountForm from "@/components/accounts/account-form";
import BudgetForm from "@/components/budgets/budget-form";
import GoalForm from "@/components/goals/goal-form";
import TransactionForm from "@/components/transactions/transaction-form";
import ReminderForm from "@/components/reminder-form";

type GetGenericDialogContentParams = {
  key: "budget" | "goal" | "transaction" | "reminder" | "account" | "";
  entityId: string | number;
  props?: Record<string, any>;
  data?: any;
};

const ContentMap: {
  [key: string]: any;
} = {
  budget: BudgetForm,
  goal: GoalForm,
  transaction: TransactionForm,
  account: AccountForm,
  reminder: ReminderForm,
};

export const getGenericDialogContent = ({
  key,
  data,
  props,
}: GetGenericDialogContentParams) => {
  const Component = ContentMap[key];
  return createElement(Component, { data, ...props });
};
