import { IPage } from "@/actions/types";
import { AiOutlineTransaction } from "react-icons/ai";
import { FaMoneyBill, FaPiggyBank } from "react-icons/fa";
import { MdDashboard, MdOutlineAccountBalanceWallet } from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";

export const PRIMARY_COLOR = "#c4002b";
export const PRIMARY_FOREGROUND_COLOR = "#fefcfa";
export const FOREGROUND_COLOR = "#001400";
export const MUTED_FOREGROUND_COLOR = "#767b9c";

export const PAGE_ROUTES = {
  LOGIN_ROUTE: "/auth/login",
  SIGN_UP_ROUTE: "/auth/signup",
};

export const MAX_LOGIN_REQUESTS_PER_MINUTE = 5;
export const MAX_SIGN_UP_REQUESTS_PER_MINUTE = 5;
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
];

export const PAGES: IPage[] = [
  {
    label: "Dashboard",
    icon: MdDashboard,
    link: "/",
  },
  {
    label: "Accounts",
    icon: MdOutlineAccountBalanceWallet,
    link: "/accounts",
  },
  {
    label: "Budgets",
    icon: FaMoneyBill,
    link: "/budgets",
  },
  {
    label: "Goals",
    icon: FaPiggyBank,
    link: "/goals",
  },
  {
    label: "Transactions",
    icon: AiOutlineTransaction,
    link: "/transactions",
  },
  {
    label: "Reports",
    icon: TbReportAnalytics,
    link: "/reports",
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
};
