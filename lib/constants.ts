import { IPage } from "@/data/types";
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
  SIGN_IN_HELP_ROUTE: "/auth/help",
  FORGOT_PASSWORD_ROUTE: "/auth/help?category=forgot-password",
  VERIFICATION_TOKEN_ROUTE: "/auth/help?category=verification-token",
} as const;

export const MAX_VERIFICATION_CODE_ATTEMPTS = 3 as const;
export const SEND_VERIFICATION_CODE_RATE_LIMIT = 3 as const;
export const MAX_LOGIN_REQUESTS_PER_MINUTE = 5 as const;
export const MAX_SIGN_UP_REQUESTS_PER_MINUTE = 5 as const;
export const MAX_RESET_PASSWORD_LINK_REQUESTS_PER_MINUTE = 3 as const;
export const EMAIL_VERIFICATION_CODE_EXPIRY_SECONDS = 300 as const;
export const EMAIL_VERIFICATION_CODE_EXPIRY_MINUTES = 5 as const;
export const EMAIL_VERIFICATION_CODE_LENGTH = 8 as const;
export const FORGOT_PASSWORD_LINK_EXPIRATION_MINUTES = 60 as const;

export const ACCOUNT_VERIFICATION_EXPIRATION_PERIOD_DAYS = 7 as const;
export const TWO_FACTOR_AUTH_INPUT_TIMEOUT_SECONDS = 180 as const;

export const EMAIL_VERIFICATION_REDIRECTION_PATHS = {
  INVALID_EMAIL: PAGE_ROUTES.LOGIN_ROUTE + "?error=invalid-email",
  EXPIRED_CODE: PAGE_ROUTES.LOGIN_ROUTE + "?error=expired-code",
  INVALID_CODE: PAGE_ROUTES.LOGIN_ROUTE + "?error=invalid-code",
  TOO_MANY_REQUESTS: PAGE_ROUTES.LOGIN_ROUTE + "?error=too-many-requests",
  VERIFICATION_TIMEOUT: PAGE_ROUTES.LOGIN_ROUTE + "?error=verification-timeout",
} as const;

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
  SEND_VERIFICATION_CODE_RATE_LIMIT: "send_verification_code_rate_limit",
  VERIFY_VERIFICATION_CODE_RATE_LIMIT: "verify_verification_code_rate_limit",
  ACCOUNT_TRANSACTIONS: "account_transactions",
  RESET_PASSWORD_LINK_REQUEST_RATE_LIMIT:
    "reset_password_link_request_rate_limit",
} as const;
