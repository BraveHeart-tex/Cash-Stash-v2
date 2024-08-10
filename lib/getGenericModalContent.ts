import AccountForm from "@/components/accounts/account-form";
import BudgetForm from "@/components/budgets/budget-form";
import CategoryForm from "@/components/categories/category-form";
import GoalForm from "@/components/goals/goal-form";
import ReminderForm from "@/components/reminder-form";
import TransactionForm from "@/components/transactions/transaction-form";
import type { GenericDialogKeyType } from "@/typings/genericModal";
import type React from "react";
import { createElement } from "react";

type GetGenericDialogContentParams = {
  key: GenericDialogKeyType;
  entityId: string | number;
  props?: Record<string, unknown>;
  data?: unknown;
};

type ContentMapType = Record<
  GenericDialogKeyType,
  // biome-ignore lint/suspicious/noExplicitAny: Will be fixed later on
  React.ComponentType<any>
>;

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
