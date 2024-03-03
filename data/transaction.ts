"use server";
import redis from "@/lib/redis";
import {
  generateCachePrefixWithUserId,
  getAccountKey,
  getAccountTransactionsKey,
  getPaginatedTransactionsKey,
  getTransactionKey,
  invalidateKeysByPrefix,
} from "@/lib/redis/redisUtils";
import prisma from "@/lib/data/db";
import { getUser } from "@/lib/auth/session";
import { processZodError } from "@/lib/utils";
import transactionSchema, {
  TransactionSchemaType,
} from "@/schemas/transaction-schema";
import { Prisma, Transaction } from "@prisma/client";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import {
  IGetPaginatedTransactionsParams,
  IGetPaginatedTransactionsResponse,
  IValidatedResponse,
} from "@/data/types";
import { CACHE_PREFIXES, PAGE_ROUTES } from "@/lib/constants";
import asyncPool from "@/lib/data/mysql";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { createId } from "@paralleldrive/cuid2";

export const createTransaction = async (
  values: TransactionSchemaType
): Promise<IValidatedResponse<Transaction>> => {
  const { user } = await getUser();

  if (!user) {
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  try {
    await asyncPool.query("START TRANSACTION;");

    const validatedData = transactionSchema.parse(values);

    // get the account balance
    const [accountResponse] = await asyncPool.query<RowDataPacket[]>(
      "SELECT balance FROM Account WHERE id = ?",
      [validatedData.accountId]
    );

    if (accountResponse.length === 0) {
      await asyncPool.query("ROLLBACK;");
      return {
        error: "Account not found",
        fieldErrors: [],
      };
    }

    const balance = accountResponse[0].balance + validatedData.amount;

    const createTransactionDto = {
      ...validatedData,
      id: createId(),
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const [createTransactionResponse] = await asyncPool.query<ResultSetHeader>(
      "INSERT INTO `Transaction` SET ?",
      [createTransactionDto]
    );

    if (createTransactionResponse.affectedRows === 0) {
      await asyncPool.query("ROLLBACK;");
      return {
        error: "Failed to create transaction",
        fieldErrors: [],
      };
    }

    const [updateAccountResponse] = await asyncPool.query<RowDataPacket[]>(
      "UPDATE Account SET balance = :balance WHERE id = :accountId; SELECT * FROM Account WHERE id = :accountId;",
      {
        balance,
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

    const updatedAccount = updateAccountResponse[1][0];

    await asyncPool.query("COMMIT;");

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
      invalidateKeysByPrefix(
        getAccountTransactionsKey(validatedData.accountId)
      ),
      redis.hset(
        getTransactionKey(createTransactionDto.id),
        createTransactionDto
      ),
      redis.hset(getAccountKey(validatedData.accountId), updatedAccount),
    ]);

    return {
      data: createTransactionDto,
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
      invalidateKeysByPrefix(
        getAccountTransactionsKey(validatedData.accountId)
      ),
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
      invalidateKeysByPrefix(
        getAccountTransactionsKey(transactionToDelete.accountId)
      ),
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

  try {
    const whereCondition: Prisma.TransactionWhereInput = {
      userId: user.id,
      description: {
        contains: query,
      },
    };

    if (category) {
      whereCondition.category = {
        equals: category,
      };
    }

    if (transactionType === "income") {
      whereCondition.amount = {
        gt: 0,
      };
    }

    if (transactionType === "expense") {
      whereCondition.amount = {
        lt: 0,
      };
    }

    if (accountId) {
      whereCondition.accountId = accountId;
    }

    const PAGE_SIZE = 12;
    const skipAmount = (pageNumber - 1) * PAGE_SIZE;

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

    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      const cachedResult = parsedData.result;
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

    const result = await prisma.transaction.findMany({
      where: whereCondition,
      orderBy: {
        [sortBy]: sortDirection,
      },
      include: {
        account: {
          select: {
            name: true,
          },
        },
      },
      take: PAGE_SIZE,
      skip: skipAmount,
    });

    const totalCount = await prisma.transaction.count({
      where: whereCondition,
    });

    await redis.set(
      cacheKey,
      JSON.stringify({
        result,
        totalCount,
      }),
      "EX",
      60 * 60 * 24
    );

    return {
      transactions: result,
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
