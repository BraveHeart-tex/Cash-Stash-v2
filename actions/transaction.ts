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
import { ResultSetHeader, RowDataPacket } from "mysql2";
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
    await asyncPool.query("ROLLBACK;");

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
    await asyncPool.query("START TRANSACTION;");

    const { amount: oldAmount, accountId: oldAccountId } = oldTransaction;

    const validatedData = transactionSchema.parse(values);

    const [updateAccountResponse] = await asyncPool.query<RowDataPacket[]>(
      `UPDATE Account SET balance = balance - :oldAmount WHERE id = :oldAccountId; UPDATE Account SET balance = balance + :amount WHERE id = :accountId;`,
      {
        oldAmount,
        oldAccountId,
        amount: validatedData.amount,
        accountId: validatedData.accountId,
      }
    );

    const affectedRows = updateAccountResponse[0].affectedRows;

    if (affectedRows === 0) {
      await asyncPool.query("ROLLBACK;");
      return {
        error: "Failed to update account balance",
        fieldErrors: [],
      };
    }

    const [transactionUpdateResponse] = await asyncPool.query<RowDataPacket[]>(
      "UPDATE Transaction SET :validatedData WHERE id = :transactionId; SELECT * FROM Transaction WHERE id = :transactionId;",
      {
        validatedData,
        transactionId,
      }
    );

    if (transactionUpdateResponse[0].affectedRows === 0) {
      await asyncPool.query("ROLLBACK;");
      return {
        error: "Failed to update transaction",
        fieldErrors: [],
      };
    }

    const updatedTransaction = transactionUpdateResponse[1][0];

    await asyncPool.query("COMMIT;");

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
      data: updatedTransaction as Transaction,
      fieldErrors: [],
    };
  } catch (error) {
    console.error(error);
    await asyncPool.query("ROLLBACK;");

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
    await asyncPool.query("START TRANSACTION;");
    const [deleteTransactionResult] = await asyncPool.query<ResultSetHeader>(
      "DELETE FROM Transaction WHERE id = :transactionId;",
      {
        transactionId: transactionToDelete.id,
      }
    );

    if (deleteTransactionResult.affectedRows === 0) {
      await asyncPool.query("ROLLBACK;");
      return {
        error: "Failed to delete transaction",
      };
    }

    const [accountUpdateResult] = await asyncPool.query<ResultSetHeader>(
      "UPDATE Account SET balance = balance - :amount WHERE id = :accountId;",
      {
        amount: transactionToDelete.amount,
        accountId: transactionToDelete.accountId,
      }
    );

    if (accountUpdateResult.affectedRows === 0) {
      await asyncPool.query("ROLLBACK;");
      return {
        error: "Failed to update account balance",
      };
    }

    await asyncPool.query("COMMIT;");

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
