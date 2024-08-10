"use server";
import {
  authenticatedAction,
  authenticatedActionWithNoParams,
} from "@/lib/auth/authUtils";
import { getUser } from "@/lib/auth/session";
import { CACHE_PREFIXES, PAGE_ROUTES } from "@/lib/constants";
import accountRepository from "@/lib/database/repository/accountRepository";
import transactionRepository from "@/lib/database/repository/transactionRepository";
import type { TransactionSelectModel } from "@/lib/database/schema";
import redisService from "@/lib/redis/redisService";
import {
  generateCachePrefixWithUserId,
  getAccountKey,
  getAccountTransactionsKey,
  getPaginatedTransactionsKey,
  getTransactionKey,
} from "@/lib/redis/redisUtils";
import logger from "@/lib/utils/logger";
import { processZodError } from "@/lib/utils/objectUtils/processZodError";
import { redirect } from "@/navigation";
import {
  type TransactionSchemaType,
  getTransactionSchema,
} from "@/schemas/transaction-schema";
import type {
  CreateTransactionReturnType,
  GetPaginatedTransactionsParams,
  GetPaginatedTransactionsReturnType,
  UpdateTransactionParam,
  UpdateTransactionReturnType,
} from "@/typings/transactions";
import { getTranslations } from "next-intl/server";
import { ZodError } from "zod";

const getTranslatedTransactionSchema = async () => {
  const zodT = await getTranslations("Zod.Transaction");
  return getTransactionSchema({
    accountRequiredErrorMessage: zodT("accountRequiredErrorMessage"),
    amountInvalidErrorMessage: zodT("amountInvalidErrorMessage"),
    amountRequiredErrorMessage: zodT("amountRequiredErrorMessage"),
    categoryRequiredErrorMessage: zodT("categoryRequiredErrorMessage"),
    descriptionRequiredErrorMessage: zodT("descriptionRequiredErrorMessage"),
    descriptionTooLongErrorMessage: zodT("descriptionTooLongErrorMessage"),
  });
};

export const createTransaction = authenticatedAction<
  CreateTransactionReturnType,
  TransactionSchemaType
>(async (values, { user }) => {
  const actionT = await getTranslations(
    "Actions.Transaction.createTransaction",
  );
  try {
    const transactionSchema = await getTranslatedTransactionSchema();
    const validatedData = transactionSchema.parse(values);

    const transactionDto = {
      ...validatedData,
      userId: user.id,
    };

    const { affectedRows, updatedAccount, createdTransaction } =
      await transactionRepository.create(transactionDto);

    if (affectedRows === 0 || !createdTransaction || !updatedAccount) {
      return {
        error: actionT("errorMessage"),
        fieldErrors: [],
      };
    }

    await Promise.all([
      redisService.invalidateKeysMatchingPrefixes([
        generateCachePrefixWithUserId(
          CACHE_PREFIXES.PAGINATED_ACCOUNTS,
          user.id,
        ),
        generateCachePrefixWithUserId(
          CACHE_PREFIXES.PAGINATED_TRANSACTIONS,
          user.id,
        ),
        getAccountTransactionsKey(validatedData.accountId),
      ]),
      redisService.hset(
        getTransactionKey(createdTransaction.id),
        createdTransaction,
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
      error: actionT("errorMessage"),
      fieldErrors: [],
    };
  }
});

export const updateTransaction = authenticatedAction<
  UpdateTransactionReturnType,
  UpdateTransactionParam
>(async ({ transactionId, values, oldTransaction }, { user }) => {
  const actionT = await getTranslations(
    "Actions.Transaction.updateTransaction",
  );
  try {
    const { amount: oldAmount, accountId: oldAccountId } = oldTransaction;

    const transactionSchema = await getTranslatedTransactionSchema();
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
        error: actionT("errorMessage"),
        fieldErrors: [],
      };
    }

    await Promise.all([
      redisService.invalidateKeysMatchingPrefixes([
        generateCachePrefixWithUserId(
          CACHE_PREFIXES.PAGINATED_ACCOUNTS,
          user.id,
        ),
        generateCachePrefixWithUserId(
          CACHE_PREFIXES.PAGINATED_TRANSACTIONS,
          user.id,
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
      error: actionT("errorMessage"),
      fieldErrors: [],
    };
  }
});

export const deleteTransactionById = authenticatedAction(
  async (transactionToDelete: TransactionSelectModel, { user }) => {
    const actionT = await getTranslations(
      "Actions.Transaction.deleteTransactionById",
    );
    try {
      const { affectedRows } =
        await transactionRepository.deleteById(transactionToDelete);

      if (affectedRows === 0) {
        return {
          error: actionT("errorMessage"),
        };
      }

      await Promise.all([
        redisService.invalidateKeysMatchingPrefixes([
          generateCachePrefixWithUserId(
            CACHE_PREFIXES.PAGINATED_ACCOUNTS,
            user.id,
          ),
          generateCachePrefixWithUserId(
            CACHE_PREFIXES.PAGINATED_TRANSACTIONS,
            user.id,
          ),
          getAccountTransactionsKey(transactionToDelete.accountId),
        ]),
      ]);

      return {
        data: actionT("successMessage"),
      };
    } catch (error) {
      logger.error(error);
      return {
        error: actionT("errorMessage"),
      };
    }
  },
);

export const getPaginatedTransactions = authenticatedAction<
  GetPaginatedTransactionsReturnType,
  GetPaginatedTransactionsParams
>(
  async ({
    transactionType,
    accountId,
    sortBy = "createdAt",
    sortDirection = "desc",
    query = "",
    pageNumber,
    categoryId,
  }) => {
    const { user } = await getUser();
    if (!user) {
      return redirect(PAGE_ROUTES.LOGIN_ROUTE);
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
        60 * 60 * 24,
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
  },
);

export const canUserCreateTransaction = authenticatedActionWithNoParams(
  async (user) => await accountRepository.checkIfUserHasAccount(user.id),
);
