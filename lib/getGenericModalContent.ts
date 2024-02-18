import EditAccountForm from "@/components/accounts/forms/EditAccountForm";
import CreateAccountForm from "@/components/accounts/forms/CreateAccountForm";
import CreateBudgetForm from "@/components/BudgetsPage/forms/CreateBudgetForm";
import EditUserBudgetForm from "@/components/BudgetsPage/forms/EditBudgetForm";
import CreateUserGoalForm from "@/components/GoalsPage/forms/CreateGoalForm";
import EditUserGoalForm from "@/components/GoalsPage/forms/EditUserGoalForm";
import CreateTransactionForm from "@/components/TransactionsPage/forms/CreateTransactionForm";
import CreateReminderForm from "@/components/Reminders/forms/CreateReminderForm";
import EditReminderForm from "@/components/Reminders/forms/EditReminderForm";
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
