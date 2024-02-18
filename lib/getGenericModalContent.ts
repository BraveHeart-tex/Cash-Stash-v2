import CreateUserGoalForm from "@/components/goals/forms/create-goal-form";
import EditUserGoalForm from "@/components/goals/forms/edit-goal-form";
import CreateTransactionForm from "@/components/transactions/forms/create-transaction-form";
import CreateReminderForm from "@/components/reminders/forms/create-reminder-form";
import EditReminderForm from "@/components/reminders/forms/edit-reminder-form";
import { createElement } from "react";
import CreateBudgetForm from "@/components/budgets/forms/create-budget-form";
import EditUserBudgetForm from "@/components/budgets/forms/edit-budget-form";
import AccountForm from "@/components/accounts/account-form";

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
  budget: {
    create: CreateBudgetForm,
    edit: EditUserBudgetForm,
  },
  goal: {
    create: CreateUserGoalForm,
    edit: EditUserGoalForm,
  },
  transaction: {
    create: CreateTransactionForm,
    // @ts-ignore
    edit: CreateTransactionForm,
  },
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
