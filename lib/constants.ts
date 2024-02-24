import { IPage } from "@/actions/types";
import { AiOutlineTransaction } from "react-icons/ai";
import { FaMoneyBill, FaPiggyBank } from "react-icons/fa";
import { MdDashboard, MdOutlineAccountBalanceWallet } from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";

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
  TRANSACTION: "transaction",
};
