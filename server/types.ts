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

type BasePaginatedResponse = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: number;
  totalPages: number;
};

type BasePaginatedActionParams = {
  pageNumber: number;
  query?: string;
};

export type BaseValidatedResponse<T> = {
  data?: T;
  error?: string;
  fieldErrors: {
    field: string;
    message: string | undefined;
  }[];
};

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

export type ExchangeRateResponse = {
  disclaimer: string;
  license: string;
  timestamp: number;
  base: string;
  rates: Rates;
};

export type Rates = {
  AED: number;
  AFN: number;
  ALL: number;
  AMD: number;
  ANG: number;
  AOA: number;
  ARS: number;
  AUD: number;
  AWG: number;
  AZN: number;
  BAM: number;
  BBD: number;
  BDT: number;
  BGN: number;
  BHD: number;
  BIF: number;
  BMD: number;
  BND: number;
  BOB: number;
  BRL: number;
  BSD: number;
  BTC: number;
  BTN: number;
  BWP: number;
  BYN: number;
  BZD: number;
  CAD: number;
  CDF: number;
  CHF: number;
  CLF: number;
  CLP: number;
  CNH: number;
  CNY: number;
  COP: number;
  CRC: number;
  CUC: number;
  CUP: number;
  CVE: number;
  CZK: number;
  DJF: number;
  DKK: number;
  DOP: number;
  DZD: number;
  EGP: number;
  ERN: number;
  ETB: number;
  EUR: number;
  FJD: number;
  FKP: number;
  GBP: number;
  GEL: number;
  GGP: number;
  GHS: number;
  GIP: number;
  GMD: number;
  GNF: number;
  GTQ: number;
  GYD: number;
  HKD: number;
  HNL: number;
  HRK: number;
  HTG: number;
  HUF: number;
  IDR: number;
  ILS: number;
  IMP: number;
  INR: number;
  IQD: number;
  IRR: number;
  ISK: number;
  JEP: number;
  JMD: number;
  JOD: number;
  JPY: number;
  KES: number;
  KGS: number;
  KHR: number;
  KMF: number;
  KPW: number;
  KRW: number;
  KWD: number;
  KYD: number;
  KZT: number;
  LAK: number;
  LBP: number;
  LKR: number;
  LRD: number;
  LSL: number;
  LYD: number;
  MAD: number;
  MDL: number;
  MGA: number;
  MKD: number;
  MMK: number;
  MNT: number;
  MOP: number;
  MRU: number;
  MUR: number;
  MVR: number;
  MWK: number;
  MXN: number;
  MYR: number;
  MZN: number;
  NAD: number;
  NGN: number;
  NIO: number;
  NOK: number;
  NPR: number;
  NZD: number;
  OMR: number;
  PAB: number;
  PEN: number;
  PGK: number;
  PHP: number;
  PKR: number;
  PLN: number;
  PYG: number;
  QAR: number;
  RON: number;
  RSD: number;
  RUB: number;
  RWF: number;
  SAR: number;
  SBD: number;
  SCR: number;
  SDG: number;
  SEK: number;
  SGD: number;
  SHP: number;
  SLL: number;
  SOS: number;
  SRD: number;
  SSP: number;
  STD: number;
  STN: number;
  SVC: number;
  SYP: number;
  SZL: number;
  THB: number;
  TJS: number;
  TMT: number;
  TND: number;
  TOP: number;
  TRY: number;
  TTD: number;
  TWD: number;
  TZS: number;
  UAH: number;
  UGX: number;
  USD: number;
  UYU: number;
  UZS: number;
  VES: number;
  VND: number;
  VUV: number;
  WST: number;
  XAF: number;
  XAG: number;
  XAU: number;
  XCD: number;
  XDR: number;
  XOF: number;
  XPD: number;
  XPF: number;
  XPT: number;
  YER: number;
  ZAR: number;
  ZMW: number;
  ZWL: number;
};

export type ExchangeRateResponseError = {
  error: boolean;
  status: number;
  message: string;
  description: string;
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
