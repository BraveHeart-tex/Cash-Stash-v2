"use server";
import { getUser } from "@/lib/auth/session";
import { redirect } from "@/navigation";
import { ZodError } from "zod";
import {
  generateCachePrefixWithUserId,
  getAccountKey,
  getAccountTransactionsKey,
  getPaginatedAccountsKey,
} from "@/lib/redis/redisUtils";
import { CACHE_PREFIXES, PAGE_ROUTES } from "@/lib/constants";
import { AccountSchemaType, getAccountSchema } from "@/schemas/account-schema";
import accountRepository from "@/lib/database/repository/accountRepository";
import transactionRepository from "@/lib/database/repository/transactionRepository";
import redisService from "@/lib/redis/redisService";
import { processZodError } from "@/lib/utils/objectUtils/processZodError";
import logger from "@/lib/utils/logger";
import { generateLabelFromEnumValue } from "@/lib/utils/stringUtils/generateLabelFromEnumValue";
import {
  GetPaginatedAccountsParams,
  GetPaginatedAccountsReturnType,
  RegisterBankAccountReturnType,
  UpdateBankAccountParams,
  UpdateBankAccountReturnType,
} from "@/typings/accounts";
import { getTranslations } from "next-intl/server";

export const registerBankAccount = async ({
  balance,
  category,
  name,
}: AccountSchemaType): RegisterBankAccountReturnType => {
  const { user } = await getUser();

  if (!user) {
    return redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  const [zodT, actionT] = await Promise.all([
    getTranslations("Zod.Account"),
    getTranslations("Actions.Account.registerBankAccount"),
  ]);

  try {
    const accountSchema = getAccountSchema({
      balanceErrorMessage: zodT("balanceErrorMessage"),
      nameErrorMessage: zodT("nameErrorMessage"),
      categoryInvalidTypeError: zodT("categoryInvalidTypeError"),
      categoryRequiredErrorMessage: zodT("categoryRequiredErrorMessage"),
    });

    const validatedData = accountSchema.parse({ balance, category, name });

    const accountDto = {
      ...validatedData,
      userId: user.id,
    };

    const { affectedRows, account } = await accountRepository.create(
      accountDto,
      true
    );

    if (affectedRows === 0 || !account) {
      return { error: actionT("internalErrorMessage"), fieldErrors: [] };
    }

    await Promise.all([
      redisService.invalidateKeysByPrefix(
        generateCachePrefixWithUserId(
          CACHE_PREFIXES.PAGINATED_ACCOUNTS,
          user.id
        )
      ),
      redisService.hset(getAccountKey(account.id), account),
    ]);

    return {
      data: account,
      fieldErrors: [],
    };
  } catch (error) {
    logger.error("Error registering bank account", error);

    if (error instanceof ZodError) {
      return processZodError(error);
    }

    if (error instanceof Error) {
      if ("code" in error && error.code === "ER_DUP_ENTRY") {
        return {
          error: actionT("duplicateAccountEntry", {
            name,
            category: generateLabelFromEnumValue(category),
          }),
          fieldErrors: [
            {
              field: "name",
              message: actionT("duplicateAccountEntryWithName", { name }),
            },
            {
              field: "category",
              message: actionT("duplicateAccountEntryWithCategory", {
                category: generateLabelFromEnumValue(category),
              }),
            },
          ],
        };
      }
    }

    return {
      error: actionT("internalErrorMessage"),
      fieldErrors: [],
    };
  }
};

export const updateBankAccount = async ({
  accountId,
  ...rest
}: UpdateBankAccountParams): UpdateBankAccountReturnType => {
  const { user } = await getUser();
  if (!user) {
    return redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  const actionT = await getTranslations("Actions.Account.updateBankAccount");

  try {
    const zodT = await getTranslations("Zod.Account");
    const accountSchema = getAccountSchema({
      balanceErrorMessage: zodT("balanceErrorMessage"),
      nameErrorMessage: zodT("nameErrorMessage"),
      categoryInvalidTypeError: zodT("categoryInvalidTypeError"),
      categoryRequiredErrorMessage: zodT("categoryRequiredErrorMessage"),
    });

    const validatedData = accountSchema.parse(rest);
    const updateDto = {
      ...validatedData,
      id: accountId,
    };

    const { affectedRows, updatedAccount } = await accountRepository.update(
      accountId,
      updateDto
    );

    if (affectedRows === 0 || !updatedAccount) {
      return {
        error: actionT("internalErrorMessage"),
        fieldErrors: [],
      };
    }

    await Promise.all([
      redisService.invalidateKeysByPrefix(
        generateCachePrefixWithUserId(
          CACHE_PREFIXES.PAGINATED_ACCOUNTS,
          user.id
        )
      ),
      redisService.invalidateKeysByPrefix(
        generateCachePrefixWithUserId(
          CACHE_PREFIXES.PAGINATED_TRANSACTIONS,
          user.id
        )
      ),
      redisService.hset(getAccountKey(accountId), updatedAccount),
    ]);

    return {
      data: updatedAccount,
      fieldErrors: [],
    };
  } catch (error) {
    logger.error("Error updating bank account", error);

    if (error instanceof ZodError) {
      return processZodError(error);
    }

    if (error instanceof Error) {
      if ("code" in error && error.code === "ER_DUP_ENTRY") {
        return {
          error: actionT("duplicateAccountEntry", {
            name: rest.name,
            category: generateLabelFromEnumValue(rest.category),
          }),
          fieldErrors: [
            {
              field: "name",
              message: actionT("duplicateAccountEntryWithName", {
                name: rest.name,
              }),
            },
            {
              field: "category",
              message: actionT("duplicateAccountEntryWithCategory", {
                category: generateLabelFromEnumValue(rest.category),
              }),
            },
          ],
        };
      }
    }

    return {
      error: actionT("internalErrorMessage"),
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
}: GetPaginatedAccountsParams): GetPaginatedAccountsReturnType => {
  const { user } = await getUser();

  if (!user) {
    return redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  const PAGE_SIZE = 12;
  const skipAmount = (pageNumber - 1) * PAGE_SIZE;

  try {
    const cacheKey = getPaginatedAccountsKey({
      userId: user.id,
      pageNumber,
      query,
      category,
      sortBy,
      sortDirection,
    });

    const cachedData = await redisService.get(cacheKey);

    if (cachedData) {
      logger.info("getPaginatedAccounts CACHE HIT");
      const parsedData = JSON.parse(cachedData);
      return {
        accounts: parsedData.accounts,
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

    await redisService.set(
      cacheKey,
      JSON.stringify({ accounts, totalCount }),
      "EX",
      5 * 60
    );

    return {
      accounts: accounts,
      hasNextPage: totalCount > skipAmount + PAGE_SIZE,
      hasPreviousPage: pageNumber > 1,
      totalPages: Math.ceil(totalCount / PAGE_SIZE),
      currentPage: pageNumber,
    };
  } catch (e) {
    logger.error("Error fetching paginated accounts", e);
    return {
      accounts: [],
      hasNextPage: false,
      hasPreviousPage: false,
      currentPage: 1,
      totalPages: 1,
    };
  }
};

export const deleteAccount = async (accountId: number) => {
  const { user } = await getUser();

  if (!user) {
    return redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  const t = await getTranslations("Actions.Account.deleteAccount");
  try {
    const affectedRows = await accountRepository.deleteById(accountId);

    if (affectedRows === 0) {
      return { error: t("anErrorOccurred") };
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
      ]),
      redisService.del(getAccountKey(accountId)),
    ]);

    return { data: t("successMessage") };
  } catch (error) {
    return { error: t("anErrorOccurred") };
  }
};

export const getTransactionsForAccount = async (accountId: number) => {
  const { user } = await getUser();

  if (!user) {
    return redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  try {
    const key = getAccountTransactionsKey(accountId);
    const cachedData = await redisService.get(key);
    if (cachedData) {
      logger.info("getTransactionsForAccount CACHE HIT");
      return JSON.parse(cachedData);
    }

    const transactions = await transactionRepository.getByAccountId(accountId);

    if (transactions.length === 0) {
      return [];
    }

    await redisService.set(key, JSON.stringify(transactions), "EX", 5 * 60);

    return transactions;
  } catch (error) {
    logger.error("Error fetching transactions for account", error);
    return [];
  }
};

export const getCurrentUserAccounts = async () => {
  const { user } = await getUser();

  if (!user) {
    return redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  return await accountRepository.getByUserId(user.id);
};

export const getCurrentUserAccountsThatHaveTransactions = async () => {
  const { user } = await getUser();

  if (!user) {
    return redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  return await accountRepository.getAccountsThatHaveTransactions(user.id);
};
