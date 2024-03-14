import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";
import { IGetPaginatedTransactionsParams } from "@/actions/types";
import { ITransactionPageSearchParams } from "@/app/transactions/page";
import { TransactionCategory } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

const isObject = (value: any): boolean => {
  return value !== null && typeof value === "object";
};

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

  return {
    error: errorMessage,
    fieldErrors: Object.entries(fieldErrors).map(([field, message]) => ({
      field,
      message: message?.join(", "),
    })),
  };
};

export const generateReadableLabelFromEnumValue = ({
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

  return keys.map((key) => {
    const label = generateReadableLabelFromEnumValue({ key, separator });
    return {
      label,
      value: key,
    };
  });
};

/**
 * Compares two objects to check if they are different. Does not compare nested objects. For that use {@link areObjectsDeepEqual}.
 * @param initialValues
 * @param values
 * @returns true if the objects are different, otherwise false.
 *
 */
export const formHasChanged = (initialValues: any, values: any): boolean => {
  const matchingKeys = Object.keys(initialValues).filter(
    (key) => key in values
  );

  return !matchingKeys.some((key) => values[key] !== initialValues[key]);
};

export const validateEnumValue = (value: any, enumObj: Record<string, any>) => {
  return Object.values(enumObj).includes(value);
};

export const getResetPasswordUrl = (email: string, token: string) => {
  return `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password/${email}?token=${token}`;
};

export function createGetPaginatedTransactionsParams(
  searchParams: ITransactionPageSearchParams
): IGetPaginatedTransactionsParams {
  const {
    transactionType,
    accountId,
    sortBy,
    sortDirection,
    category,
    page,
    query,
  } = searchParams;

  return {
    transactionType,
    accountId: accountId ? parseInt(accountId) : undefined,
    sortBy: (sortBy || "createdAt") as "amount" | "createdAt",
    sortDirection: (sortDirection || "desc") as "asc" | "desc",
    category: category as TransactionCategory,
    pageNumber: page ? parseInt(page) : 1,
    query,
  };
}

export const getPageSizeAndSkipAmount = (pageNumber: number) => {
  const PAGE_SIZE = 12;
  const skipAmount = (pageNumber - 1) * PAGE_SIZE;
  return { pageSize: PAGE_SIZE, skipAmount };
};

export function convertIsoToMysqlDatetime(isoDatetimeString: string) {
  // Create a new Date object from the ISO datetime string
  const isoDatetime = new Date(isoDatetimeString);

  // Extract the date components
  const year = isoDatetime.getFullYear();
  const month = ("0" + (isoDatetime.getMonth() + 1)).slice(-2); // Months are zero-based
  const day = ("0" + isoDatetime.getDate()).slice(-2);
  const hours = ("0" + isoDatetime.getHours()).slice(-2);
  const minutes = ("0" + isoDatetime.getMinutes()).slice(-2);
  const seconds = ("0" + isoDatetime.getSeconds()).slice(-2);

  // Format the datetime string in MySQL format
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
