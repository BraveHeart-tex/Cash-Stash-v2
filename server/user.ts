"use server";
import { PAGE_ROUTES } from "@/lib/constants";
import { db } from "@/lib/database/connection";
import currencyRatesRepository from "@/lib/database/repository/currencyRatesRepository";
import userRepository from "@/lib/database/repository/userRepository";
import { accounts, budgets, goals, transactions } from "@/lib/database/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import logger from "@/lib/utils/logger";
import redisService from "@/lib/redis/redisService";
import { authenticatedAction } from "@/lib/auth/authUtils";
import { UpdateUserCurrencyPreferenceReturnType } from "@/typings/user-actions";

export const updateUserCurrencyPreference = authenticatedAction<
  UpdateUserCurrencyPreferenceReturnType,
  string
>(async (symbol: string, { user }) => {
  if (symbol.length !== 3) {
    return {
      error: "Invalid currency symbol.",
    };
  }

  try {
    const [result] = await userRepository.updateUser(user.id, {
      preferredCurrency: symbol,
    });

    if (!result.affectedRows) {
      return {
        error:
          "An error occurred while updating the currency preference. Please try again later.",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    logger.error("error updating currency preference", error);
    return {
      error:
        "An error occurred while updating the currency preference. Please try again later.",
    };
  }
});

type ConvertTransactionsToNewCurrencyParams = {
  oldSymbol: string;
  newSymbol: string;
};

export const convertTransactionsToNewCurrency = authenticatedAction(
  async (
    { oldSymbol, newSymbol }: ConvertTransactionsToNewCurrencyParams,
    { user }
  ) => {
    if (newSymbol.length !== 3) {
      return {
        error: "Invalid currency symbol.",
      };
    }

    try {
      const [oldRate, newCurrencyRate] = await Promise.all([
        currencyRatesRepository.getCurrencyRateBySymbol(oldSymbol),
        currencyRatesRepository.getCurrencyRateBySymbol(newSymbol),
      ]);

      if (!newCurrencyRate || !oldRate) {
        return {
          error: "Invalid currency symbol.",
        };
      }

      await db.transaction(async (trx) => {
        const updateQueries = [
          trx
            .update(accounts)
            .set({
              balance: sql<number>`${accounts.balance} * ${newCurrencyRate.rate} / ${oldRate.rate}`,
            })
            .where(eq(accounts.userId, user.id)),
          trx
            .update(budgets)
            .set({
              spentAmount: sql<number>`${budgets.spentAmount} * ${newCurrencyRate.rate} / ${oldRate.rate}`,
              budgetAmount: sql<number>`${budgets.budgetAmount} * ${newCurrencyRate.rate} / ${oldRate.rate}`,
            })
            .where(eq(budgets.userId, user.id)),
          trx
            .update(goals)
            .set({
              goalAmount: sql<number>`${goals.goalAmount} * ${newCurrencyRate.rate} / ${oldRate.rate}`,
              currentAmount: sql<number>`${goals.currentAmount} * ${newCurrencyRate.rate} / ${oldRate.rate}`,
            })
            .where(eq(goals.userId, user.id)),
          trx
            .update(transactions)
            .set({
              amount: sql<number>`amount * ${newCurrencyRate.rate} / ${oldRate.rate}`,
            })
            .where(eq(transactions.userId, user.id)),
        ];

        const results = await Promise.allSettled(updateQueries);
        return results;
      });

      await redisService.invalidateKeysByUserId(user.id);
      revalidatePath(PAGE_ROUTES.HOME_PAGE);
      revalidatePath(PAGE_ROUTES.ACCOUNTS_ROUTE);
      revalidatePath(PAGE_ROUTES.BUDGETS_ROUTE);
      revalidatePath(PAGE_ROUTES.GOALS_ROUTE);
      revalidatePath(PAGE_ROUTES.TRANSACTIONS_ROUTE);
      revalidatePath(PAGE_ROUTES.REPORTS_ROUTE);

      return {
        success:
          "Successfully converted transactions to the new currency rate.",
      };
    } catch (error) {
      logger.error("error converting transactions to new currency", error);
      return {
        error:
          "An error occurred while converting transactions to the new currency rate. Please try again later.",
      };
    }
  }
);
