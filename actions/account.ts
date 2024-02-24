"use server";
import prisma from "@/lib/data/db";
import { getUser } from "@/lib/auth/session";
import { processZodError, validateEnumValue } from "@/lib/utils";
import { accountSchema } from "@/schemas";
import { AccountSchemaType } from "@/schemas/CreateUserAccountSchema";
import { Account, AccountCategory } from "@prisma/client";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import {
  IValidatedResponse,
  IGetPaginatedAccountsParams,
  IGetPaginatedAccountsResponse,
} from "@/actions/types";
import redis from "@/lib/redis";
import {
  getAccountKey,
  getPaginatedAccountsKey,
  invalidateKeysByPrefix,
} from "@/lib/redis/redisUtils";
import { CACHE_PREFIXES } from "@/lib/constants";

export const registerBankAccount = async ({
  balance,
  category,
  name,
}: AccountSchemaType): Promise<IValidatedResponse<Account>> => {
  const { user } = await getUser();

  if (!user) {
    redirect("/login");
  }

  try {
    const validatedData = accountSchema.parse({ balance, category, name });

    const createdAccount = await prisma.account.create({
      data: {
        ...validatedData,
        userId: user.id,
      },
    });

    if (!createdAccount) {
      return { error: "Error creating account.", fieldErrors: [] };
    }

    await Promise.all([
      invalidateKeysByPrefix(CACHE_PREFIXES.PAGINATED_ACCOUNTS),
      redis.hset(getAccountKey(createdAccount.id), createdAccount),
    ]);

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

    await Promise.all([
      invalidateKeysByPrefix(CACHE_PREFIXES.PAGINATED_ACCOUNTS),
      redis.hset(getAccountKey(updatedAccount.id), updatedAccount),
    ]);

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
  const { user } = await getUser();

  if (!user) {
    redirect("/login");
  }

  const PAGE_SIZE = 12;
  const skipAmount = (pageNumber - 1) * PAGE_SIZE;

  if (category && !validateEnumValue(category, AccountCategory)) {
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

  const cacheKey = getPaginatedAccountsKey({
    userId: user.id,
    pageNumber,
    query,
    category,
    sortBy,
    sortDirection,
    orderByCondition: orderByCondition?.orderBy
      ? JSON.stringify(orderByCondition)
      : "",
  });

  const cachedData = await redis.get(cacheKey);
  if (cachedData) {
    console.info("CACHE HIT");
    const parsedData = JSON.parse(cachedData);
    return {
      accounts: parsedData.accounts,
      hasNextPage: parsedData.totalCount > skipAmount + PAGE_SIZE,
      hasPreviousPage: pageNumber > 1,
      totalPages: Math.ceil(parsedData.totalCount / PAGE_SIZE),
      currentPage: pageNumber,
    };
  }
  console.info("CACHE MISS");

  const [accounts, totalCount] = await Promise.all([
    prisma.account.findMany({
      skip: skipAmount,
      take: PAGE_SIZE,
      where: {
        userId: user?.id,
        name: {
          contains: query,
        },
        ...categoryQuery,
      },
      ...orderByCondition,
    }),
    prisma.account.count({
      where: {
        userId: user?.id,
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

  await redis.set(
    cacheKey,
    JSON.stringify({ accounts, totalCount }),
    "EX",
    5 * 60
  );

  return {
    accounts,
    hasNextPage: totalCount > skipAmount + PAGE_SIZE,
    hasPreviousPage: pageNumber > 1,
    totalPages: Math.ceil(totalCount / PAGE_SIZE),
    currentPage: pageNumber,
  };
};

export const deleteAccount = async (accountId: string) => {
  const { user } = await getUser();

  if (!user) {
    redirect("/login");
  }

  try {
    const deletedAccount = await prisma.account.delete({
      where: {
        id: accountId,
      },
    });

    if (!deletedAccount) {
      return { error: "An error occurred while deleting the account." };
    }

    await Promise.all([
      invalidateKeysByPrefix(CACHE_PREFIXES.PAGINATED_ACCOUNTS),
      redis.del(getAccountKey(accountId)),
    ]);

    return { data: deletedAccount };
  } catch (error) {
    return { error: "An error occurred while deleting the account." };
  }
};
