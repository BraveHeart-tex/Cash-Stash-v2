"use server";
import { getUser } from "@/lib/auth/session";
import { processZodError, validateEnumValue } from "@/lib/utils";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import {
  IGetPaginatedAccountsParams,
  IValidatedResponse,
} from "@/actions/types";
import redis from "@/lib/redis/redisConnection";
import {
  generateCachePrefixWithUserId,
  getAccountKey,
  getAccountTransactionsKey,
  getPaginatedAccountsKey,
  invalidateKeysByPrefix,
} from "@/lib/redis/redisUtils";
import { CACHE_PREFIXES, PAGE_ROUTES } from "@/lib/constants";
import accountSchema, { AccountSchemaType } from "@/schemas/account-schema";
import { createAccountDto } from "@/lib/database/dto/accountDto";
import accountRepository from "@/lib/database/repository/accountRepository";
import { Account, AccountCategory } from "@/entities/account";
import transactionRepository from "@/lib/database/repository/transactionRepository";

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

    const accountDto = createAccountDto(validatedData, user.id);

    const affectedRows = await accountRepository.create(accountDto);

    if (affectedRows === 0) {
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
      data: accountDto as Account,
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

    const { affectedRows, updatedAccount } =
      await accountRepository.update(updateDto);

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
      data: updatedAccount as Account,
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

    const { accounts, totalCount } = await accountRepository.getMultiple({
      userId: user.id,
      page: pageNumber,
      query,
      category,
      sortBy,
      sortDirection,
    });

    if (accounts.length === 0) {
      return {
        accounts: [],
        hasNextPage: false,
        hasPreviousPage: false,
        currentPage: 1,
        totalPages: 1,
      };
    }

    await redis.set(
      cacheKey,
      JSON.stringify({ accounts, totalCount }),
      "EX",
      5 * 60
    );

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
    const affectedRows = await accountRepository.deleteById(accountId);

    if (affectedRows === 0) {
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

    const transactions = await transactionRepository.getByAccountId(accountId);

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

  return await accountRepository.getByUserId(user.id);
};
