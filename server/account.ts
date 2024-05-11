"use server";
import { ZodError } from "zod";
import {
  generateCachePrefixWithUserId,
  getAccountKey,
  getPaginatedAccountsKey,
} from "@/lib/redis/redisUtils";
import { CACHE_PREFIXES } from "@/lib/constants";
import { AccountSchemaType, getAccountSchema } from "@/schemas/account-schema";
import accountRepository from "@/lib/database/repository/accountRepository";
import redisService from "@/lib/redis/redisService";
import { processZodError } from "@/lib/utils/objectUtils/processZodError";
import logger from "@/lib/utils/logger";
import { generateLabelFromEnumValue } from "@/lib/utils/stringUtils/generateLabelFromEnumValue";
import {
  DeleteAccountReturnType,
  GetPaginatedAccountsParams,
  GetPaginatedAccountsReturnType,
  RegisterBankAccountReturnType,
  UpdateBankAccountParams,
  UpdateBankAccountReturnType,
} from "@/typings/accounts";
import { getTranslations } from "next-intl/server";
import { User } from "lucia";
import {
  authenticatedAction,
  authenticatedActionWithNoParams,
} from "@/lib/auth/authUtils";

const getAccountSchemaWithTranslations = async () => {
  const zodT = await getTranslations("Zod.Account");
  return getAccountSchema({
    balanceErrorMessage: zodT("balanceErrorMessage"),
    nameErrorMessage: zodT("nameErrorMessage"),
    categoryInvalidTypeError: zodT("categoryInvalidTypeError"),
    categoryRequiredErrorMessage: zodT("categoryRequiredErrorMessage"),
  });
};

export const registerBankAccount = authenticatedAction<
  RegisterBankAccountReturnType,
  AccountSchemaType
>(async ({ balance, category, name }, { user }) => {
  const actionT = await getTranslations("Actions.Account.registerBankAccount");

  try {
    const accountSchema = await getAccountSchemaWithTranslations();

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
      redisService.invalidateKeysStartingWith(
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
});

export const updateBankAccount = authenticatedAction<
  UpdateBankAccountReturnType,
  UpdateBankAccountParams
>(async ({ accountId, ...rest }, { user }) => {
  const actionT = await getTranslations("Actions.Account.updateBankAccount");

  try {
    const accountSchema = await getAccountSchemaWithTranslations();
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
      redisService.invalidateKeysStartingWith(
        generateCachePrefixWithUserId(
          CACHE_PREFIXES.PAGINATED_ACCOUNTS,
          user.id
        )
      ),
      redisService.invalidateKeysStartingWith(
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
});

export const getPaginatedAccounts = authenticatedAction<
  GetPaginatedAccountsReturnType,
  GetPaginatedAccountsParams
>(async ({ pageNumber, query, category, sortBy, sortDirection }, { user }) => {
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
});

export const deleteAccount = authenticatedAction<
  DeleteAccountReturnType,
  number
>(async (accountId, { user }) => {
  const t = await getTranslations("Actions.Account.deleteAccount");
  try {
    const affectedRows = await accountRepository.deleteById(accountId);

    if (affectedRows === 0) {
      return { error: t("anErrorOccurred") };
    }

    await Promise.all([
      redisService.invalidateKeysMatchingPrefixes([
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
});

export const getCurrentUserAccounts = authenticatedActionWithNoParams(
  async (user) => {
    return await accountRepository.getByUserId(user.id);
  }
);

export const getCurrentUserAccountsThatHaveTransactions =
  authenticatedActionWithNoParams(
    async (user: User) =>
      await accountRepository.getAccountsThatHaveTransactions(user.id)
  );
