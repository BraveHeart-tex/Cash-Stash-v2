"use server";
import prisma from "@/lib/data/db";
import { getUser } from "@/lib/auth/session";
import { processZodError, validateEnumValue } from "@/lib/utils";
import { Account, AccountCategory } from "@prisma/client";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import { IValidatedResponse, IGetPaginatedAccountsParams } from "@/data/types";
import redis from "@/lib/redis";
import {
  generateCachePrefixWithUserId,
  getAccountKey,
  getAccountTransactionsKey,
  getPaginatedAccountsKey,
  invalidateKeysByPrefix,
} from "@/lib/redis/redisUtils";
import { CACHE_PREFIXES, PAGE_ROUTES } from "@/lib/constants";
import accountSchema, { AccountSchemaType } from "@/schemas/account-schema";
import connection from "@/lib/data/mysql";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export const registerBankAccount = async ({
  balance,
  category,
  name,
}: AccountSchemaType): Promise<IValidatedResponse<Account>> => {
  const { user } = await getUser();

  if (!user) {
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
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
      invalidateKeysByPrefix(
        generateCachePrefixWithUserId(
          CACHE_PREFIXES.PAGINATED_ACCOUNTS,
          user.id
        )
      ),
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
  const { user } = await getUser();
  if (!user) {
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

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
      invalidateKeysByPrefix(
        generateCachePrefixWithUserId(
          CACHE_PREFIXES.PAGINATED_ACCOUNTS,
          user.id
        )
      ),
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
}: IGetPaginatedAccountsParams) => {
  // TODO: Make this HOF
  const { user } = await getUser();

  if (!user) {
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
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

  let accountsQuery = `SELECT * FROM ACCOUNT where userId = :userId and name like :query`;
  let totalCountQuery = `SELECT COUNT(*) as totalCount FROM ACCOUNT where userId = :userId and name like :query`;

  let accountsQueryParams: {
    userId: string;
    query: string;
    category?: AccountCategory;
    limit?: number;
    offset?: number;
  } = {
    userId: user.id,
    query: `%${query}%`,
  };

  let totalCountQueryParams: {
    userId: string;
    query: string;
    category?: AccountCategory;
  } = {
    userId: user.id,
    query: `%${query}%`,
  };

  if (category) {
    accountsQuery += ` and category = :category`;
    totalCountQuery += ` and category = :category`;
    accountsQueryParams.category = category;
    totalCountQueryParams.category = category;
  }

  if (sortBy && sortDirection) {
    const validSortDirection =
      sortDirection.toUpperCase() === "DESC" ? "DESC" : "ASC";
    accountsQuery += ` ORDER BY balance ${validSortDirection}`;
  }

  accountsQuery += ` LIMIT :limit OFFSET :offset`;
  accountsQueryParams.limit = PAGE_SIZE;
  accountsQueryParams.offset = skipAmount;

  try {
    const cacheKey = getPaginatedAccountsKey({
      userId: user.id,
      pageNumber,
      query,
      category,
      sortBy,
      sortDirection,
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

    const [accounts] = await connection.query<RowDataPacket[]>(
      accountsQuery,
      accountsQueryParams
    );

    const [totalCountResult] = await connection.query<RowDataPacket[]>(
      totalCountQuery,
      totalCountQueryParams
    );

    const totalCount = totalCountResult[0].totalCount;

    await redis.set(
      cacheKey,
      JSON.stringify({ accounts, totalCount }),
      "EX",
      5 * 60
    );

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
  } catch (e) {
    console.error("Error fetching paginated accounts", e);
    return {
      accounts: [],
      hasNextPage: false,
      hasPreviousPage: false,
      currentPage: 1,
      totalPages: 1,
    };
  }
};

export const deleteAccount = async (accountId: string) => {
  const { user } = await getUser();

  if (!user) {
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  try {
    const [deletedAccount] = await connection.query<ResultSetHeader>(
      "DELETE FROM ACCOUNT WHERE id = ?",
      [accountId]
    );

    if (deletedAccount.affectedRows === 0) {
      return { error: "An error occurred while deleting the account." };
    }

    await Promise.all([
      invalidateKeysByPrefix(
        generateCachePrefixWithUserId(
          CACHE_PREFIXES.PAGINATED_ACCOUNTS,
          user.id
        )
      ),
      invalidateKeysByPrefix(
        generateCachePrefixWithUserId(
          CACHE_PREFIXES.PAGINATED_TRANSACTIONS,
          user.id
        )
      ),
      redis.del(getAccountKey(accountId)),
    ]);

    return { data: "Account deleted successfully." };
  } catch (error) {
    return { error: "An error occurred while deleting the account." };
  }
};

export const getTransactionsForAccount = async (accountId: string) => {
  const { user } = await getUser();

  if (!user) {
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  try {
    const key = getAccountTransactionsKey(accountId);
    const cachedData = await redis.get(key);
    if (cachedData) {
      console.info("getTransactionsForAccount CACHE HIT");
      return JSON.parse(cachedData);
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        accountId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });

    if (transactions.length === 0) {
      return [];
    }

    await redis.set(key, JSON.stringify(transactions), "EX", 5 * 60);

    return transactions;
  } catch (error) {
    console.error("Error fetching transactions for account", error);
    return [];
  }
};

export const getCurrentUserAccounts = async () => {
  const { user } = await getUser();

  if (!user) {
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  return prisma.account.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      name: true,
    },
  });
};
