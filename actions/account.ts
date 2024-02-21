"use server";
import ACCOUNT_OPTIONS from "@/lib/CreateUserAccountOptions";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { processZodError } from "@/lib/utils";
import { accountSchema } from "@/schemas";
import { AccountSchemaType } from "@/schemas/CreateUserAccountSchema";
import { Account } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import { getUserSession } from "./auth";
import {
  IValidatedResponse,
  IGetPaginatedAccountsParams,
  IGetPaginatedAccountsResponse,
} from "./types";

export const registerBankAccount = async ({
  balance,
  category,
  name,
}: AccountSchemaType): Promise<IValidatedResponse<Account>> => {
  const currentUser = await getCurrentUser(cookies().get("token")?.value!);

  if (!currentUser) {
    return {
      error: "You are not authorized to perform this action.",
      fieldErrors: [],
    };
  }

  try {
    const validatedData = accountSchema.parse({ balance, category, name });

    const createdAccount = await prisma.account.create({
      data: {
        ...validatedData,
        userId: currentUser.id,
      },
    });

    if (!createdAccount) {
      return { error: "Error creating account.", fieldErrors: [] };
    }

    return {
      data: createdAccount,
      fieldErrors: [],
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return processZodError(error);
    }

    return {
      error:
        "An error occurred while registering your bank account. Please try again later.",
      fieldErrors: [],
    };
  }
};

export const updateBankAccount = async ({
  accountId,
  ...rest
}: AccountSchemaType & { accountId: string }): Promise<
  IValidatedResponse<Account>
> => {
  if (!accountId) {
    return {
      error: "Invalid request. Please provide an account ID.",
      fieldErrors: [],
    };
  }

  try {
    const validatedData = accountSchema.parse(rest);

    const updatedAccount = await prisma.account.update({
      where: {
        id: accountId,
      },
      data: validatedData,
    });

    if (!updatedAccount) {
      return {
        error:
          "An error occurred while updating your bank account. Please try again later.",
        fieldErrors: [],
      };
    }

    return {
      data: updatedAccount,
      fieldErrors: [],
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return processZodError(error);
    }

    return {
      error:
        "An error occurred while updating your bank account. Please try again later.",
      fieldErrors: [],
    };
  }
};
export const getPaginatedAccounts = async ({
  pageNumber,
  query,
  category,
  sortBy,
  sortDirection,
}: IGetPaginatedAccountsParams): Promise<IGetPaginatedAccountsResponse> => {
  const result = await getUserSession();
  if (result.error) {
    redirect("/login");
  }

  const PAGE_SIZE = 12;
  const skipAmount = (pageNumber - 1) * PAGE_SIZE;

  if (category && !ACCOUNT_OPTIONS.hasOwnProperty(category)) {
    return {
      accounts: [],
      hasNextPage: false,
      hasPreviousPage: false,
      currentPage: 1,
      totalPages: 1,
    };
  }

  let orderByCondition;
  if (sortBy && sortDirection) {
    orderByCondition = {
      orderBy: {
        [sortBy]: sortDirection,
      },
    };
  }

  const categoryQuery = category ? { category } : {};

  const [accounts, totalCount] = await Promise.all([
    prisma.account.findMany({
      skip: skipAmount,
      take: PAGE_SIZE,
      where: {
        userId: result.user?.id,
        name: {
          contains: query,
        },
        ...categoryQuery,
      },
      ...orderByCondition,
    }),
    prisma.account.count({
      where: {
        userId: result.user?.id,
        name: {
          contains: query,
        },
        ...categoryQuery,
      },
    }),
  ]);

  if (accounts.length === 0) {
    return {
      accounts: [],
      hasNextPage: false,
      hasPreviousPage: false,
      currentPage: 1,
      totalPages: 1,
    };
  }

  return {
    accounts,
    hasNextPage: totalCount > skipAmount + PAGE_SIZE,
    hasPreviousPage: pageNumber > 1,
    totalPages: Math.ceil(totalCount / PAGE_SIZE),
    currentPage: pageNumber,
  };
};
export const getAccountsByCurrentUser = async () => {
  const currentUser = await getCurrentUser(cookies().get("token")?.value!);

  if (!currentUser) {
    redirect("/login");
  }

  try {
    const accounts = await prisma.account.findMany({
      where: {
        userId: currentUser.id,
      },
    });

    return { accounts, error: null };
  } catch (error) {
    return {
      error: "An error occurred while getting the accounts.",
      accounts: [],
    };
  }
};
