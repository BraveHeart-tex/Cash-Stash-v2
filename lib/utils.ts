import prisma from "@/app/libs/prismadb";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { MdDashboard, MdOutlineAccountBalanceWallet } from "react-icons/md";
import { ZodObject } from "zod";
import { IconType } from "react-icons/lib";
import { FaMoneyBill, FaPiggyBank } from "react-icons/fa";
import { TbReportAnalytics } from "react-icons/tb";
import { AiOutlineTransaction } from "react-icons/ai";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

export type TableMap = {
  [key in TableName]: (typeof prisma)[key];
};

export type WhereCondition<T> = {
  [key in keyof T]?: T[key];
};

export type SelectCondition<T> = {
  [key in keyof T]?: boolean;
};

export interface IGenericParams<T> {
  tableName: TableName;
  whereCondition?: WhereCondition<T>;
  selectCondition?: SelectCondition<T>;
}

export type CreateGenericInput<T> = {
  [key in keyof Omit<T, "id" | "createdAt" | "updatedAt">]: T[key];
};

export type CreateGenericWithCurrentUserInput<T> = {
  [key in keyof Omit<T, "id" | "createdAt" | "updatedAt" | "userId">]: T[key];
};

export type UpdateGenericInput<T> = {
  [key in keyof Partial<T>]: T[key];
};

export type TableName =
  | "userAccount"
  | "transaction"
  | "budget"
  | "goal"
  | "reminder";

export type Page =
  | "Dashboard"
  | "Accounts"
  | "Budgets"
  | "Goals"
  | "Transactions"
  | "Reports"
  | "Settings";

export interface IPage {
  label: Page;
  icon: IconType;
  link: string;
}

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

export function generateFormFields(schema: ZodObject<any>) {
  const formFields = [];

  for (const key of Object.keys(schema.shape)) {
    const fieldSchema = schema.shape[key];
    const description = fieldSchema._def.description;

    const parsedDescription = description
      .split(",")
      .map((item: string) => item.trim());

    const fieldType = parsedDescription
      .find((item: string) => item.startsWith("type:"))
      .split(":")[1]
      .trim();

    const fieldLabel = parsedDescription
      .find((item: string) => item.startsWith("label:"))
      .split(":")[1]
      .trim();

    const fieldObject: {
      name: string;
      type: string;
      label: string;
      options?: string[];
    } = {
      name: key,
      type: fieldType,
      label: fieldLabel,
    };

    if (fieldType === "combobox") {
      const fieldOptions = parsedDescription
        .find((item: string) => item.startsWith("options:"))
        .split(":")[1]
        .trim()
        .split("-");

      fieldObject["options"] = fieldOptions;
    }

    formFields.push(fieldObject);
  }

  return formFields;
}

export const processDate = (date: Date) => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

export const thousandSeparator = (value: number) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
