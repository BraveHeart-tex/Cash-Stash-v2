import EditUserAccountForm from "@/app/components/AccountsPage/forms/EditUserAccountForm";
import CreateUserAccountForm from "@/app/components/AccountsPage/forms/CreateUserAccountForm";
import CreateBudgetForm from "@/app/components/BudgetsPage/forms/CreateBudgetForm";
import EditUserBudgetForm from "@/app/components/BudgetsPage/forms/EditBudgetForm";
import CreateUserGoalForm from "@/app/components/GoalsPage/forms/CreateGoalForm";
import EditUserGoalForm from "@/app/components/GoalsPage/forms/EditUserGoalForm";
import CreateTransactionForm from "@/app/components/TransactionsPage/forms/CreateTransactionForm";
import { createElement } from "react";

interface IGetGenericDialogContentParams {
  mode: "create" | "edit";
  key: "budget" | "goal" | "transaction" | "reminder" | "account" | "";
  entityId: number;
}

interface EditFormProps {
  entityId: number;
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
    edit: CreateTransactionForm,
  },
  reminder: {
    create: CreateTransactionForm,
    edit: CreateTransactionForm,
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
}: IGetGenericDialogContentParams) => {
  console.log(mode, key, entityId);

  const Component = ContentMap[key][mode];

  if (mode === "edit") {
    return createElement(Component, { entityId });
  }

  return createElement(Component);
};
