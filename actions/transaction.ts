"use server";
import {
  generateCachePrefixWithUserId,
  getAccountKey,
  getAccountTransactionsKey,
  getPaginatedTransactionsKey,
  getTransactionKey,
} from "@/lib/redis/redisUtils";
import { getUser } from "@/lib/auth/session";
import { processZodError } from "@/lib/utils";
import transactionSchema, {
  TransactionSchemaType,
} from "@/schemas/transaction-schema";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import {
  IGetPaginatedTransactionsParams,
  IGetPaginatedTransactionsResponse,
  IValidatedResponse,
  TransactionResponse,
} from "@/actions/types";
import { CACHE_PREFIXES, PAGE_ROUTES } from "@/lib/constants";
import asyncPool from "@/lib/database/connection";
import { RowDataPacket } from "mysql2";
import { Transaction } from "@/entities/transaction";
import redisService from "@/lib/redis/redisService";
import transactionRepository from "@/lib/database/repository/transactionRepository";
import { createTransactionDto } from "@/lib/database/dto/transactionDto";

export const createTransaction = async (
  values: TransactionSchemaType
): Promise<IValidatedResponse<Transaction>> => {
  const { user } = await getUser();

  if (!user) {
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  try {
    const validatedData = transactionSchema.parse(values);

    const transactionDto = createTransactionDto(validatedData, user.id);

    const { affectedRows, updatedAccount } =
      await transactionRepository.create(transactionDto);

    if (affectedRows === 0 || !updatedAccount) {
      return {
        error:
          "We encountered a problem while creating the transaction. Please try again later.",
        fieldErrors: [],
      };
    }

    await Promise.all([
      redisService.invalidateMultipleKeysByPrefix([
        generateCachePrefixWithUserId(
          CACHE_PREFIXES.PAGINATED_ACCOUNTS,
          user.id
        ),
        generateCachePrefixWithUserId(
          CACHE_PREFIXES.PAGINATED_TRANSACTIONS,
          user.id
        ),
        getAccountTransactionsKey(validatedData.accountId),
      ]),
      redisService.hset(getTransactionKey(transactionDto.id), transactionDto),
      redisService.hset(getAccountKey(validatedData.accountId), updatedAccount),
    ]);

    return {
      data: transactionDto,
      fieldErrors: [],
    };
  } catch (error) {
    console.error(error);

    if (error instanceof ZodError) {
      return processZodError(error);
    }

    return {
      error:
        "A problem occurred while creating the transaction. Please try again later.",
      fieldErrors: [],
    };
  }
};

export const updateTransaction = async (
  transactionId: string,
  values: TransactionSchemaType,
  oldTransaction: Transaction
): Promise<IValidatedResponse<Transaction>> => {
  const { user } = await getUser();

  if (!user) {
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  try {
    const { amount: oldAmount, accountId: oldAccountId } = oldTransaction;

    const validatedData = transactionSchema.parse(values);

    const oldAccountData = {
      oldAmount,
      oldAccountId,
      amount: validatedData.amount,
      accountId: validatedData.accountId,
    };

    const transactionDto = {
      ...validatedData,
      id: transactionId,
    };

    const { affectedRows, updatedRow } = await transactionRepository.update(
      oldAccountData,
      transactionDto
    );

    if (affectedRows === 0 || !updatedRow) {
      return {
        error:
          "We encountered a problem while updating the transaction. Please try again later.",
        fieldErrors: [],
      };
    }

    await Promise.all([
      redisService.invalidateMultipleKeysByPrefix([
        generateCachePrefixWithUserId(
          CACHE_PREFIXES.PAGINATED_ACCOUNTS,
          user.id
        ),
        generateCachePrefixWithUserId(
          CACHE_PREFIXES.PAGINATED_TRANSACTIONS,
          user.id
        ),
        getAccountTransactionsKey(validatedData.accountId),
      ]),
    ]);

    return {
      data: updatedRow,
      fieldErrors: [],
    };
  } catch (error) {
    console.error(error);

    if (error instanceof ZodError) {
      return processZodError(error);
    }

    return {
      error:
        "A problem occurred while updating the transaction. Please try again later.",
      fieldErrors: [],
    };
  }
};

export const deleteTransactionById = async (
  transactionToDelete: Transaction
) => {
  const { user } = await getUser();
  if (!user) {
    return redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  try {
    const { affectedRows } =
      await transactionRepository.deleteById(transactionToDelete);

    if (affectedRows === 0) {
      return {
        error:
          "We encountered a problem while deleting the transaction. Please try again later.",
      };
    }

    await Promise.all([
      redisService.invalidateMultipleKeysByPrefix([
        generateCachePrefixWithUserId(
          CACHE_PREFIXES.PAGINATED_ACCOUNTS,
          user.id
        ),
        generateCachePrefixWithUserId(
          CACHE_PREFIXES.PAGINATED_TRANSACTIONS,
          user.id
        ),
        getAccountTransactionsKey(transactionToDelete.accountId),
      ]),
    ]);

    return {
      data: "Transaction deleted successfully",
    };
  } catch (error) {
    console.error(error);
    await asyncPool.query("ROLLBACK;");
    return {
      error:
        "We encountered a problem while deleting the transaction. Please try again later.",
    };
  }
};

export const getPaginatedTransactions = async ({
  transactionType,
  accountId,
  sortBy = "createdAt",
  sortDirection = "desc",
  query,
  pageNumber,
  category,
}: IGetPaginatedTransactionsParams): Promise<IGetPaginatedTransactionsResponse> => {
  const { user } = await getUser();
  if (!user) {
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  const PAGE_SIZE = 12;
  const skipAmount = (pageNumber - 1) * PAGE_SIZE;

  let transactionsQuery = `SELECT t.*, a.name as accountName FROM Transaction t join Account a on t.accountId = a.id WHERE t.userId = :userId AND description LIKE :query `;
  let totalTransactionsCountQuery = `SELECT COUNT(*) FROM Transaction WHERE userId = :userId AND description LIKE :query`;

  let transactionsQueryParams: {
    userId: string;
    query: string;
    transactionType?: string;
    accountId?: string;
    sortBy?: string;
    sortDirection?: string;
    category?: string;
    limit?: number;
    offset?: number;
  } = {
    userId: user.id,
    query: `%${query}%`,
  };

  let totalTransactionsCountQueryParams: {
    userId: string;
    query: string;
    transactionType?: string;
    accountId?: string;
    category?: string;
  } = {
    userId: user.id,
    query: `%${query}%`,
  };

  if (category) {
    transactionsQuery += ` AND category = :category`;
    totalTransactionsCountQuery += ` AND category = :category`;
    transactionsQueryParams.category = category;
    totalTransactionsCountQueryParams.category = category;
  }

  if (sortBy && sortDirection) {
    const sortByOptions = ["createdAt", "amount"];
    const sortDirections = ["asc", "desc"];

    const validSortBy = sortByOptions.includes(sortBy) ? sortBy : "createdAt";
    const validSortDirection = sortDirections.includes(sortDirection)
      ? sortDirection
      : "desc";

    transactionsQuery += ` ORDER BY ${validSortBy} ${validSortDirection}`;
  }

  if (transactionType === "income") {
    transactionsQuery += ` AND amount > 0`;
    totalTransactionsCountQuery += ` AND amount > 0`;
  }

  if (transactionType === "expense") {
    transactionsQuery += ` AND amount < 0`;
    totalTransactionsCountQuery += ` AND amount < 0`;
  }

  if (accountId) {
    transactionsQuery += ` AND accountId = :accountId`;
    totalTransactionsCountQuery += ` AND accountId = :accountId`;
    transactionsQueryParams.accountId = accountId;
    totalTransactionsCountQueryParams.accountId = accountId;
  }

  transactionsQuery += ` LIMIT :limit OFFSET :offset`;
  transactionsQueryParams.limit = PAGE_SIZE;
  transactionsQueryParams.offset = skipAmount;

  try {
    const cacheKey = getPaginatedTransactionsKey({
      userId: user.id,
      transactionType,
      accountId,
      sortBy,
      sortDirection,
      query,
      pageNumber,
      category,
    });

    const cachedData = await redisService.get(cacheKey);

    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      const cachedResult = parsedData.transactions;
      const totalCount = parsedData.totalCount;

      return {
        transactions: cachedResult.map((result: Transaction) => ({
          ...result,
          createdAt: new Date(result.createdAt),
          updatedAt: new Date(result.updatedAt),
        })),
        hasNextPage: totalCount > skipAmount + PAGE_SIZE,
        hasPreviousPage: pageNumber > 1,
        totalPages: Math.ceil(totalCount / PAGE_SIZE),
        currentPage: pageNumber,
      };
    }

    const [transactionsPromise, totalCountPromise] = await Promise.all([
      asyncPool.query<RowDataPacket[]>(
        transactionsQuery,
        transactionsQueryParams
      ),
      asyncPool.query<RowDataPacket[]>(
        totalTransactionsCountQuery,
        totalTransactionsCountQueryParams
      ),
    ]);

    const [transactions] = transactionsPromise;
    const [totalCountResult] = totalCountPromise;

    const totalCount = totalCountResult[0].totalCount;

    await redisService.set(
      cacheKey,
      JSON.stringify({
        transactions,
        totalCount,
      }),
      "EX",
      60 * 60 * 24
    );

    return {
      transactions: transactions as TransactionResponse[],
      hasNextPage: totalCount > skipAmount + PAGE_SIZE,
      hasPreviousPage: pageNumber > 1,
      totalPages: Math.ceil(totalCount / PAGE_SIZE),
      currentPage: pageNumber,
    };
  } catch (error) {
    console.error(error);
    return {
      transactions: [],
      hasNextPage: false,
      hasPreviousPage: false,
      totalPages: 1,
      currentPage: 1,
    };
  }
};

export const userCanCreateTransaction = async () => {
  const { user } = await getUser();
  if (!user) {
    return redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  const [accounts] = await asyncPool.query<RowDataPacket[]>(
    "SELECT id FROM Account WHERE userId = :userId limit 1",
    { userId: user.id }
  );

  return accounts.length > 0;
};
