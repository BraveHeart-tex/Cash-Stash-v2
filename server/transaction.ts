"use server";
import {
  generateCachePrefixWithUserId,
  getAccountKey,
  getAccountTransactionsKey,
  getPaginatedTransactionsKey,
  getTransactionKey,
} from "@/lib/redis/redisUtils";
import { getUser } from "@/lib/auth/session";
import transactionSchema, {
  TransactionSchemaType,
} from "@/schemas/transaction-schema";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import {
  GetPaginatedTransactionsParams,
  GetPaginatedTransactionsResponse,
  BaseValidatedResponse,
} from "@/server/types";
import { CACHE_PREFIXES, PAGE_ROUTES } from "@/lib/constants";
import redisService from "@/lib/redis/redisService";
import transactionRepository from "@/lib/database/repository/transactionRepository";
import { createTransactionDto } from "@/lib/database/dto/transactionDto";
import accountRepository from "@/lib/database/repository/accountRepository";
import { TransactionSelectModel } from "@/lib/database/schema";
import { processZodError } from "@/lib/utils/objectUtils/processZodError";
import logger from "@/lib/utils/logger";

export const createTransaction = async (
  values: TransactionSchemaType
): Promise<BaseValidatedResponse<TransactionSelectModel>> => {
  const { user } = await getUser();

  if (!user) {
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  try {
    const validatedData = transactionSchema.parse(values);

    const transactionDto = createTransactionDto(validatedData, user.id);

    const { affectedRows, updatedAccount, createdTransaction } =
      await transactionRepository.create(transactionDto);

    if (affectedRows === 0 || !createdTransaction || !updatedAccount) {
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
      redisService.hset(
        getTransactionKey(createdTransaction.id),
        createdTransaction
      ),
      redisService.hset(getAccountKey(validatedData.accountId), updatedAccount),
    ]);

    return {
      data: createdTransaction,
      fieldErrors: [],
    };
  } catch (error) {
    logger.error(error);

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
  transactionId: number,
  values: TransactionSchemaType,
  oldTransaction: TransactionSelectModel
): Promise<BaseValidatedResponse<TransactionSelectModel>> => {
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

    const { affectedRows, updatedTransaction } =
      await transactionRepository.update(oldAccountData, {
        ...validatedData,
        id: transactionId,
      });

    if (affectedRows === 0 || !updatedTransaction) {
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
      data: updatedTransaction,
      fieldErrors: [],
    };
  } catch (error) {
    logger.error(error);

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
  transactionToDelete: TransactionSelectModel
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
    logger.error(error);
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
  query = "",
  pageNumber,
  categoryId,
}: GetPaginatedTransactionsParams): Promise<GetPaginatedTransactionsResponse> => {
  const { user } = await getUser();
  if (!user) {
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  const PAGE_SIZE = 12;
  const skipAmount = (pageNumber - 1) * PAGE_SIZE;

  try {
    const cacheKey = getPaginatedTransactionsKey({
      userId: user.id,
      transactionType,
      accountId,
      sortBy,
      sortDirection,
      query,
      pageNumber,
      categoryId,
    });

    const cachedData = await redisService.get(cacheKey);

    if (cachedData) {
      logger.info("PAGINATED TRANSACTIONS CACHE HIT");
      const parsedData = JSON.parse(cachedData);
      const cachedResult = parsedData.transactions;
      const totalCount = parsedData.totalCount;

      return {
        transactions: cachedResult,
        hasNextPage: totalCount > skipAmount + PAGE_SIZE,
        hasPreviousPage: pageNumber > 1,
        totalPages: Math.ceil(totalCount / PAGE_SIZE),
        currentPage: pageNumber,
      };
    }

    const { transactions, totalCount } =
      await transactionRepository.getMultiple({
        userId: user.id,
        transactionType,
        accountId,
        sortBy,
        sortDirection,
        query,
        page: pageNumber,
        categoryId,
      });

    if (transactions.length === 0) {
      return {
        transactions: [],
        hasNextPage: false,
        hasPreviousPage: false,
        totalPages: 1,
        currentPage: 1,
      };
    }

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
      transactions,
      hasNextPage: totalCount > skipAmount + PAGE_SIZE,
      hasPreviousPage: pageNumber > 1,
      totalPages: Math.ceil(totalCount / PAGE_SIZE),
      currentPage: pageNumber,
    };
  } catch (error) {
    logger.error(error);
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

  return await accountRepository.checkIfUserHasAccount(user.id);
};
