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
import { Transaction } from "@/entities/transaction";
import redisService from "@/lib/redis/redisService";
import transactionRepository from "@/lib/database/repository/transactionRepository";
import { createTransactionDto } from "@/lib/database/dto/transactionDto";
import accountRepository from "@/lib/database/repository/accountRepository";

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

    const { transactions, totalCount } =
      await transactionRepository.getMultiple({
        userId: user.id,
        transactionType,
        accountId,
        sortBy,
        sortDirection,
        query,
        page: pageNumber,
        category,
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

  return await accountRepository.checkIfUserHasAccount(user.id);
};
