import { IconType } from "react-icons/lib";
import { PAGE_ROUTES } from "@/lib/constants";

export type GenericFilterOption<T> = {
  label: string;
  data: T;
  icon: React.JSX.Element;
};

export type InsightsData = {
  totalIncome: number;
  totalExpense: number;
  netIncome: number;
  savingsRate: string;
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

export type PageLink = (typeof PAGE_ROUTES)[keyof typeof PAGE_ROUTES];

export type QueryStringComboboxItem = {
  label: string;
  value: string;
};

export type TransactionPageSearchParams = {
  transactionType?: string;
  accountId?: string;
  sortBy?: string;
  sortDirection?: string;
  categoryId?: number;
  page?: string;
  query?: string;
};
