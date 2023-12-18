import EditUserAccountForm from "@/app/components/AccountsPage/forms/EditUserAccountForm";
import CreateUserAccountForm from "@/app/components/AccountsPage/forms/CreateUserAccountForm";
import CreateBudgetForm from "@/app/components/BudgetsPage/forms/CreateBudgetForm";
import EditUserBudgetForm from "@/app/components/BudgetsPage/forms/EditBudgetForm";
import CreateUserGoalForm from "@/app/components/GoalsPage/forms/CreateGoalForm";
import EditUserGoalForm from "@/app/components/GoalsPage/forms/EditUserGoalForm";
import CreateTransactionForm from "@/app/components/TransactionsPage/forms/CreateTransactionForm";
import CreateReminderForm from "@/app/components/Reminders/forms/CreateReminderForm";
import EditReminderForm from "@/app/components/Reminders/forms/EditReminderForm";
import { createElement } from "react";

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
    create: CreateUserAccountForm,
    edit: EditUserAccountForm,
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
