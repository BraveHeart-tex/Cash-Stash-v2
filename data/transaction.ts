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
import pool from "@/lib/data/mysql";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { createId } from "@paralleldrive/cuid2";

export const createTransaction = async (
  values: TransactionSchemaType
): Promise<IValidatedResponse<Transaction>> => {
  const { user } = await getUser();

  if (!user) {
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const validatedData = transactionSchema.parse(values);

    // get the account balance
    const [accountResponse] = await connection.query<RowDataPacket[]>(
      "SELECT balance FROM Account WHERE id = ?",
      [validatedData.accountId]
    );

    if (accountResponse.length === 0) {
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

    const [createTransactionResponse] = await connection.query<ResultSetHeader>(
      "INSERT INTO `Transaction` SET ?",
      [createTransactionDto]
    );

    if (createTransactionResponse.affectedRows === 0) {
      throw new Error("Failed to create transaction");
    }

    const [updateAccountResponse] = await connection.query<RowDataPacket[]>(
      "UPDATE Account SET balance = :balance WHERE id = :accountId; SELECT * FROM Account WHERE id = :accountId;",
      {
        balance,
        accountId: validatedData.accountId,
      }
    );

    const affectedRows = updateAccountResponse[0].affectedRows;

    if (affectedRows === 0) {
      throw new Error("Failed to update account balance");
    }

    const updatedAccount = updateAccountResponse[1][0];

    await connection.commit();

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
    await connection.rollback();

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

  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const { amount: oldAmount, accountId: oldAccountId } = oldTransaction;

    const validatedData = transactionSchema.parse(values);

    const [updateAccountResponse] = await connection.query<RowDataPacket[]>(
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
      throw new Error("Failed to update account balance");
    }

    const [transactionUpdateResponse] = await connection.query<RowDataPacket[]>(
      "UPDATE Transaction SET :validatedData WHERE id = :transactionId; SELECT * FROM Transaction WHERE id = :transactionId;",
      {
        validatedData,
        transactionId,
      }
    );

    if (transactionUpdateResponse[0].affectedRows === 0) {
      throw new Error("Failed to update transaction");
    }

    const updatedTransaction = transactionUpdateResponse[1][0];

    await connection.commit();

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
    await connection.rollback();

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
    const deletedTransaction = prisma.transaction.delete({
      where: {
        id: transactionToDelete.id,
      },
    });

    const updatedAccount = prisma.account.update({
      where: {
        id: transactionToDelete.accountId,
      },
      data: {
        balance: {
          decrement: transactionToDelete.amount,
        },
      },
    });

    // eslint-disable-next-line no-unused-vars
    const [_, deleteTransactionResult] = await prisma.$transaction([
      updatedAccount,
      deletedTransaction,
    ]);

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
      transaction: deleteTransactionResult,
    };
  } catch (error) {
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
