import { IPage } from "@/actions/types";
import { AiOutlineTransaction } from "react-icons/ai";
import { FaMoneyBill, FaPiggyBank } from "react-icons/fa";
import { MdDashboard, MdOutlineAccountBalanceWallet } from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";

export const PRIMARY_COLOR = "#c4002b" as const;
export const PRIMARY_FOREGROUND_COLOR = "#fefcfa" as const;
export const FOREGROUND_COLOR = "#001400" as const;
export const MUTED_FOREGROUND_COLOR = "#767b9c" as const;

export const PAGE_ROUTES = {
  HOME_PAGE: "/",
  LOGIN_ROUTE: "/auth/login",
  SIGN_UP_ROUTE: "/auth/signup",
  ACCOUNTS_ROUTE: "/accounts",
  BUDGETS_ROUTE: "/budgets",
  GOALS_ROUTE: "/goals",
  TRANSACTIONS_ROUTE: "/transactions",
  REPORTS_ROUTE: "/reports",
  EMAIL_VERIFICATION_ROUTE: "/auth/email-verification",
} as const;

export const MAX_LOGIN_REQUESTS_PER_MINUTE = 5 as const;
export const MAX_SIGN_UP_REQUESTS_PER_MINUTE = 5 as const;
export const EMAIL_VERIFICATION_CODE_EXPIRY_SECONDS = 300 as const;
export const EMAIL_VERIFICATION_CODE_EXPIRY_MINUTES = 5 as const;
export const EMAIL_VERIFICATION_CODE_LENGTH = 8 as const;

export const EMAIL_VERIFICATION_ERROR_PATHS = {};

export const MONTHS_OF_THE_YEAR = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export const PAGES: IPage[] = [
  {
    label: "Dashboard",
    icon: MdDashboard,
    link: PAGE_ROUTES.HOME_PAGE,
  },
  {
    label: "Accounts",
    icon: MdOutlineAccountBalanceWallet,
    link: PAGE_ROUTES.ACCOUNTS_ROUTE,
  },
  {
    label: "Budgets",
    icon: FaMoneyBill,
    link: PAGE_ROUTES.BUDGETS_ROUTE,
  },
  {
    label: "Goals",
    icon: FaPiggyBank,
    link: PAGE_ROUTES.GOALS_ROUTE,
  },
  {
    label: "Transactions",
    icon: AiOutlineTransaction,
    link: PAGE_ROUTES.TRANSACTIONS_ROUTE,
  },
  {
    label: "Reports",
    icon: TbReportAnalytics,
    link: PAGE_ROUTES.REPORTS_ROUTE,
  },
];

export const CACHE_PREFIXES = {
  ACCOUNT: "account",
  PAGINATED_ACCOUNTS: "paginated_accounts",
  PAGINATED_BUDGETS: "paginated_budgets",
  PAGINATED_TRANSACTIONS: "paginated_transactions",
  PAGINATED_GOALS: "paginated_goals",
  LOGIN_RATE_LIMIT: "login_rate_limit",
  SIGN_UP_RATE_LIMIT: "sign_up_rate_limit",
  TRANSACTION: "transaction",
  BUDGET: "budget",
  GOAL: "goal",
} as const;
