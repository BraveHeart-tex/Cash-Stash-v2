import prisma from "@/lib/db";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { MdDashboard, MdOutlineAccountBalanceWallet } from "react-icons/md";
import { ZodError, ZodObject } from "zod";
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
  | "account"
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

export const formatMoney = (value: number) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  return formatter.format(value);
};

// Utility function to check if a value is an object
const isObject = (value: any): boolean => {
  return value !== null && typeof value === "object";
};

/**
 * Check if two objects are deeply equal.
 * @param {any} obj1 - The first object.
 * @param {any} obj2 - The second object.
 * @returns {boolean} True if objects are deeply equal, otherwise false.
 */
export const areObjectsDeepEqual = (obj1: any, obj2: any): boolean => {
  // Check if both objects are strictly equal
  if (obj1 === obj2) return true;

  // Check if either object is null or undefined
  if (obj1 == null || obj2 == null) return false;

  // Check if the number of keys in both objects is different
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;

  // Check if all key-value pairs are equal
  for (const key of keys1) {
    const value1 = obj1[key];
    const value2 = obj2[key];

    // Check if both values are objects for deep comparison
    const areObjects = isObject(value1) && isObject(value2);

    // If both values are objects, recursively check equality
    // If not, perform a simple equality check
    if (
      (areObjects && !areObjectsDeepEqual(value1, value2)) ||
      (!areObjects && value1 !== value2)
    ) {
      return false;
    }
  }

  return true;
};

/**
 * Processes a ZodError instance and extracts error information.
 * @param {ZodError} error - The ZodError object to process.
 * @returns An object containing error and fieldErrors properties.
 */
export const processZodError = (error: ZodError) => {
  const fieldErrors = error.flatten().fieldErrors;
  const errorMessages = Object.entries(fieldErrors).map(
    // eslint-disable-next-line no-unused-vars
    ([_, message]) => `${message}`
  );

  const errorMessage = errorMessages.join(", ");

  const errorObject = {
    error: errorMessage,
    fieldErrors: Object.entries(fieldErrors).map(([field, message]) => ({
      field,
      message: message?.join(", "),
    })),
  };

  return errorObject;
};

export const formatTransactionDate = (date: Date) => {
  const formattedDate = processDate(date).split(" ");
  const [day, month, year] = formattedDate[0].split("/");
  const [hours, minutes, seconds] = formattedDate[1].split(":");
  return `${day} ${MONTHS_OF_THE_YEAR[parseInt(month) - 1]} ${year}, ${hours}:${minutes}:${seconds}`;
};

export const generateReadbleEnumValue = ({
  key,
  separator = "_",
}: {
  key: string;
  separator?: string;
}) => {
  let label = key.replace(separator, " ");

  if (label.split(" ").length > 1) {
    const words = label.split(" ");
    const capitalizedWords = words.map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
    label = capitalizedWords.join(" ");
  } else {
    label = label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
  }

  return label;
};

export const generateReadbleEnumLabels = ({
  enumObj,
  separator = "_",
}: {
  enumObj: Record<string, string>;
  separator?: string;
}) => {
  const keys = Object.keys(enumObj);

  const readableLabels = keys.map((key) => {
    const label = generateReadbleEnumValue({ key, separator });
    return {
      label,
      value: key,
    };
  });

  return readableLabels;
};
