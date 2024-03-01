"use server";
import redis from "@/lib/redis";
import {
  generateCachePrefixWithUserId,
  getAccountKey,
  getAccountTransactionsKey,
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

export const createTransaction = async (
  values: TransactionSchemaType
): Promise<IValidatedResponse<Transaction>> => {
  const { user } = await getUser();

  if (!user) {
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  try {
    const validatedData = transactionSchema.parse(values);
    const account = await prisma.account.findUnique({
      where: {
        id: validatedData.accountId,
      },
    });

    if (!account) {
      return {
        error: "Account not found",
        fieldErrors: [],
      };
    }

    const balance = account.balance + validatedData.amount;

    const newTransaction = prisma.transaction.create({
      data: {
        ...validatedData,
        userId: user.id,
      },
    });

    const updatedAccount = prisma.account.update({
      where: {
        id: validatedData.accountId,
      },
      data: {
        balance,
      },
    });

    // eslint-disable-next-line no-unused-vars
    const [_, transaction] = await prisma.$transaction([
      updatedAccount,
      newTransaction,
    ]);

    await Promise.all([
      invalidateKeysByPrefix(
        generateCachePrefixWithUserId(
          CACHE_PREFIXES.PAGINATED_ACCOUNTS,
          user.id
        )
      ),
      invalidateKeysByPrefix(
        getAccountTransactionsKey(validatedData.accountId)
      ),
      redis.hset(getTransactionKey(transaction.id), newTransaction),
      redis.hset(getAccountKey(validatedData.accountId), updatedAccount),
    ]);

    return {
      data: transaction,
      fieldErrors: [],
    };
  } catch (error) {
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

    let dbTransactions: any[] = [];

    if (oldAccountId !== validatedData.accountId) {
      dbTransactions.push(
        prisma.account.update({
          where: {
            id: oldAccountId,
          },
          data: {
            balance: {
              decrement: oldAmount,
            },
          },
        })
      );
    }

    dbTransactions.push(
      prisma.transaction.update({
        where: {
          id: transactionId,
        },
        data: {
          ...validatedData,
        },
      })
    );

    dbTransactions.push(
      prisma.account.update({
        where: {
          id: validatedData.accountId,
        },
        data: {
          balance: {
            increment: validatedData.amount,
          },
        },
      })
    );

    // eslint-disable-next-line no-unused-vars
    const [oldAccount, updatedTransaction, newAccount] =
      await prisma.$transaction(dbTransactions);

    await Promise.all([
      invalidateKeysByPrefix(
        generateCachePrefixWithUserId(
          CACHE_PREFIXES.PAGINATED_ACCOUNTS,
          user.id
        )
      ),
      invalidateKeysByPrefix(
        getAccountTransactionsKey(validatedData.accountId)
      ),
    ]);

    return {
      data: updatedTransaction,
      fieldErrors: [],
    };
  } catch (error) {
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
