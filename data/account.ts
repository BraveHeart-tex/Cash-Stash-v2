"use server";
import { getUser } from "@/lib/auth/session";
import { processZodError, validateEnumValue } from "@/lib/utils";
import { Account, AccountCategory } from "@prisma/client";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import { IValidatedResponse, IGetPaginatedAccountsParams } from "@/data/types";
import redis from "@/lib/redis";
import { createId } from "@paralleldrive/cuid2";
import {
  generateCachePrefixWithUserId,
  getAccountKey,
  getAccountTransactionsKey,
  getPaginatedAccountsKey,
  invalidateKeysByPrefix,
} from "@/lib/redis/redisUtils";
import { CACHE_PREFIXES, PAGE_ROUTES } from "@/lib/constants";
import accountSchema, { AccountSchemaType } from "@/schemas/account-schema";
import asyncPool from "@/lib/data/mysql";
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

    const accountDto = {
      id: createId(),
      name: validatedData.name,
      balance: validatedData.balance,
      category: validatedData.category,
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const [createdAccount] = await asyncPool.query<ResultSetHeader>(
      `INSERT INTO ACCOUNT (id, name, balance, category, userId, createdAt, updatedAt) values (:id, :name, :balance, :category, :userId, :createdAt, :updatedAt);`,
      accountDto
    );

    if (createdAccount?.affectedRows === 0) {
      return { error: "Error creating account.", fieldErrors: [] };
    }

    await Promise.all([
      invalidateKeysByPrefix(
        generateCachePrefixWithUserId(
          CACHE_PREFIXES.PAGINATED_ACCOUNTS,
          user.id
        )
      ),
      redis.hset(getAccountKey(accountDto.id), accountDto),
    ]);

    return {
      data: accountDto,
      fieldErrors: [],
    };
  } catch (error) {
    console.error("Error registering bank account", error);
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
    const updateDto = {
      ...validatedData,
      id: accountId,
      updatedAt: new Date(),
    };

    const [updatedAccountResult] = await asyncPool.query<RowDataPacket[]>(
      `UPDATE ACCOUNT set name = :name, balance = :balance, category = :category, updatedAt = :updatedAt where id = :id; SELECT * from ACCOUNT where id = :id;`,
      updateDto
    );

    const affectedRows = updatedAccountResult?.[0]?.affectedRows;
    const updatedAccount = updatedAccountResult?.[1]?.[0];

    if (affectedRows === 0 || !updatedAccount) {
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
      redis.hset(getAccountKey(accountId), updatedAccount),
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
        accounts: parsedData.accounts as Account[],
        hasNextPage: parsedData.totalCount > skipAmount + PAGE_SIZE,
        hasPreviousPage: pageNumber > 1,
        totalPages: Math.ceil(parsedData.totalCount / PAGE_SIZE),
        currentPage: pageNumber,
      };
    }

    const [accountsPromise, totalCountResultPromise] = await Promise.all([
      asyncPool.query<RowDataPacket[]>(accountsQuery, accountsQueryParams),
      asyncPool.query<RowDataPacket[]>(totalCountQuery, totalCountQueryParams),
    ]);

    const [accounts] = accountsPromise;
    const [totalCountResult] = totalCountResultPromise;

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
      accounts: accounts as Account[],
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
    const [deletedAccount] = await asyncPool.query<ResultSetHeader>(
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

    const [transactionsResult] = await asyncPool.query<RowDataPacket[]>(
      `SELECT * FROM TRANSACTION where accountId = :accountId order by createdAt desc limit 10`,
      { accountId }
    );

    if (transactionsResult.length === 0) {
      return [];
    }

    await redis.set(key, JSON.stringify(transactionsResult), "EX", 5 * 60);

    return transactionsResult;
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

  const [accounts] = await asyncPool.query<RowDataPacket[]>(
    "SELECT id, name from ACCOUNT where userId = ?",
    [user.id]
  );

  return accounts;
};
