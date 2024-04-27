import { IconType } from "react-icons/lib";
import {
  AccountSelectModel,
  BudgetSelectModel,
  CategoryInsertModel,
  CategorySelectModel,
  GoalSelectModel,
  ReminderSelectModel,
  TransactionSelectModel,
} from "@/lib/database/schema";
import { CATEGORY_TYPES, PAGE_ROUTES } from "@/lib/constants";
import {
  BasePaginatedActionParams,
  BasePaginatedResponse,
} from "@/typings/baseTypes";

export type GetPaginatedAccountsParams = BasePaginatedActionParams & {
  sortBy?: string;
  sortDirection?: string;
  category?: AccountSelectModel["category"];
};

export type IGetPaginatedAccountsResponse = BasePaginatedResponse & {
  accounts: AccountWithTransactions[];
};

export type IGetPaginatedBudgetsParams = BasePaginatedActionParams & {
  category?: number;
  sortBy?: string;
  sortDirection?: string;
};

export type GetPaginatedBudgetsResponse = BasePaginatedResponse & {
  budgets: BudgetWithCategory[];
};

export type GetPaginatedGoalsParams = BasePaginatedActionParams & {
  sortBy?: string;
  sortDirection?: string;
};

export type GetPaginatedGoalsResponse = BasePaginatedResponse & {
  goals: GoalSelectModel[];
};

export type GetPaginatedRemindersParams = BasePaginatedActionParams & {
  startDate?: string;
  endDate?: string;
};

export type GetPaginatedRemindersResponse = BasePaginatedResponse & {
  reminders: ReminderSelectModel[];
};

export type SerializedUserAccount = Omit<
  AccountSelectModel,
  "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
};

export type GenericFilterOption<T> = {
  label: string;
  data: T;
  icon: React.JSX.Element;
};

export type UpdateBudgetResponse = {
  budget?: BudgetSelectModel;
  error?: string;
  fieldErrors: {
    field: string;
    message: string | undefined;
  }[];
};

export type InsightsData = {
  totalIncome: number;
  totalExpense: number;
  netIncome: number;
  savingsRate: string;
};

export type SerializedTransaction = Omit<
  TransactionSelectModel,
  "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
  account?: Partial<AccountSelectModel>;
};

export type SerializedReminder = Omit<
  ReminderSelectModel,
  "createdAt" | "updatedAt" | "reminderDate"
> & {
  createdAt: string;
  updatedAt: string;
  reminderDate: string;
};

export type NavigationItem = {
  label: string;
  icon: IconType;
  link: PageLink;
  isPrimary?: boolean;
};

export type RecaptchaResponse = {
  success: boolean;
  challenge_ts: string;
  hostname: string;
  "error-codes": string[];
};

export type GetPaginatedTransactionsParams = BasePaginatedActionParams & {
  transactionType?: string;
  accountId?: number;
  sortBy: "amount" | "createdAt";
  sortDirection?: "asc" | "desc";
  createdAtStart?: Date;
  createdAtEnd?: Date;
  createdAtOperator?: "equals" | "before" | "after" | "range";
  categoryId?: number;
};

export type GetPaginatedTransactionsResponse = BasePaginatedResponse & {
  transactions: TransactionWithCategoryAndAccountName[];
};

export type AccountWithTransactions = AccountSelectModel & {
  transactions: TransactionWithCategoryAndAccountName[];
};

export type MonthlyTransactionsData = {
  date: string;
  income: number;
  expense: number;
};

export type ComboboxOption = {
  icon?: IconType;
  label: string | number;
  value: string;
};

export type ConvertCurrencyType = {
  symbol: string;
  rate: number;
  label: string;
  amount: number;
};

export type CategoryType = (typeof CATEGORY_TYPES)[keyof typeof CATEGORY_TYPES];

export type PageLink = (typeof PAGE_ROUTES)[keyof typeof PAGE_ROUTES];

export type FieldError = {
  field: string;
  message: string | undefined;
};

export type QueryStringComboboxItem = {
  label: string;
  value: string;
};

export type GenericDialogKeyType =
  | "budget"
  | "goal"
  | "transaction"
  | "reminder"
  | "account"
  | "category";

export type GetPaginatedCategoriesParams = BasePaginatedActionParams & {
  type?: CategoryType;
};

export type GetPaginatedCategoriesResponse = BasePaginatedResponse & {
  categories: CategorySelectModel[];
};

export type CategoryUpdateModel = Required<Pick<CategoryInsertModel, "id">> &
  Partial<Omit<CategoryInsertModel, "id">>;

export type TransactionPageSearchParams = {
  transactionType?: string;
  accountId?: string;
  sortBy?: string;
  sortDirection?: string;
  categoryId?: number;
  page?: string;
  query?: string;
};

export type BudgetWithCategory = BudgetSelectModel & { category: string };
export type TransactionWithCategoryAndAccountName = TransactionSelectModel & {
  category: string;
} & { accountName: string };

export type MaskOptions = {
  /** The string to be prepended to the masked value. */
  prefix?: string;
  /** The string to be appended to the masked value. */
  suffix?: string;
  /** Whether to include a thousands separator in the masked value. */
  includeThousandsSeparator?: boolean;
  /** The symbol used as the thousands separator in the masked value. */
  thousandsSeparatorSymbol?: string;
  /** Whether to allow a decimal component in the masked value. */
  allowDecimal?: boolean;
  /** The symbol used as the decimal component in the masked value. */
  decimalSymbol?: string;
  /** The maximum number of decimal places in the masked value. */
  decimalLimit?: number;
  /** The maximum number of integer digits in the masked value. */
  integerLimit?: number;
  /** Whether to allow negative values in the masked value. */
  allowNegative?: boolean;
  /** Whether to allow leading zeroes in the masked value. */
  allowLeadingZeroes?: boolean;
};
