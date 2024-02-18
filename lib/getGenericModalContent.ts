import EditAccountForm from "@/components/accounts/forms/edit-account-form";
import CreateAccountForm from "@/components/accounts/forms/create-account-form";
import CreateUserGoalForm from "@/components/goals/forms/create-goal-form";
import EditUserGoalForm from "@/components/goals/forms/edit-goal-form";
import CreateTransactionForm from "@/components/transactions/forms/create-transaction-form";
import CreateReminderForm from "@/components/reminders/forms/create-reminder-form";
import EditReminderForm from "@/components/reminders/forms/edit-reminder-form";
import { createElement } from "react";
import CreateBudgetForm from "@/components/budgets/forms/create-budget-form";
import EditUserBudgetForm from "@/components/budgets/forms/edit-budget-form";

interface IGetGenericDialogContentParams {
  mode: "create" | "edit";
  key: "budget" | "goal" | "transaction" | "reminder" | "account" | "";
  entityId: string;
  props?: any;
}

interface EditFormProps {
  entityId: string;
}

interface ContentMap {
  [key: string]: {
    create: React.ComponentType<any>;
    edit: React.ComponentType<EditFormProps>;
  };
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
  account: {
    create: CreateAccountForm,
    edit: EditAccountForm,
  },
};

export const getGenericDialogContent = ({
  mode,
  key,
  entityId,
  props,
}: IGetGenericDialogContentParams) => {
  const Component = ContentMap[key][mode];

  if (mode === "edit") {
    return createElement(Component, { entityId, ...props });
  }

  return createElement(Component, { ...props });
};
