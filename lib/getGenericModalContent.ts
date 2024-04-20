import { createElement } from "react";
import AccountForm from "@/components/accounts/account-form";
import BudgetForm from "@/components/budgets/budget-form";
import GoalForm from "@/components/goals/goal-form";
import TransactionForm from "@/components/transactions/transaction-form";
import ReminderForm from "@/components/reminder-form";
import { GenericDialogKeyType } from "@/server/types";
import CategoryForm from "@/components/categories/category-form";

type GetGenericDialogContentParams = {
  key: GenericDialogKeyType;
  entityId: string | number;
  props?: Record<string, any>;
  data?: any;
};

type ContentMapType = Record<GenericDialogKeyType, React.ComponentType<any>>;

const ContentMap: ContentMapType = {
  budget: BudgetForm,
  goal: GoalForm,
  transaction: TransactionForm,
  account: AccountForm,
  reminder: ReminderForm,
  category: CategoryForm,
};

export const getGenericDialogContent = ({
  key,
  data,
  props,
}: GetGenericDialogContentParams) => {
  const Component = ContentMap[key];
  return createElement(Component, { data, ...props });
};
