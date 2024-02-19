import CreateReminderForm from "@/components/reminders/forms/create-reminder-form";
import EditReminderForm from "@/components/reminders/forms/edit-reminder-form";
import { createElement } from "react";
import AccountForm from "@/components/accounts/account-form";
import BudgetForm from "@/components/budgets/budget-form";
import GoalForm from "@/components/goals/goal-form";
import TransactionForm from "@/components/transactions/transaction-form";

interface IGetGenericDialogContentParams {
  mode: "create" | "edit";
  key: "budget" | "goal" | "transaction" | "reminder" | "account" | "";
  entityId: string;
  props?: any;
  data?: any;
}

interface ContentMap {
  [key: string]: any;
}

const ContentMap: ContentMap = {
  budget: BudgetForm,
  goal: GoalForm,
  transaction: TransactionForm,
  reminder: {
    create: CreateReminderForm,
    edit: EditReminderForm,
  },
  account: AccountForm,
};

export const getGenericDialogContent = ({
  mode,
  key,
  data,
  props,
}: IGetGenericDialogContentParams) => {
  const Component = ContentMap[key];

  if (mode === "edit") {
    return createElement(Component, { data, ...props });
  }

  return createElement(Component, { ...props });
};
