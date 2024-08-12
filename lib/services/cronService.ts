import { ACCOUNT_VERIFICATION_EXPIRATION_PERIOD_DAYS } from "@/lib/constants";
import { db } from "@/lib/database/connection";
import * as currencyRatesRepository from "@/lib/database/repository/currencyRatesRepository";
import emailVerificationCodeRepository from "@/lib/database/repository/emailVerificationCodeRepository";
import { users } from "@/lib/database/schema";
import * as exchangeRatesService from "@/lib/services/exchangeRatesService";
import { convertISOToMysqlDateTime } from "@/lib/utils/dateUtils/convertISOToMysqlDateTime";
import logger from "@/lib/utils/logger";
import { and, eq, lte } from "drizzle-orm";

export const deleteUnverifiedAccounts = async () => {
  try {
    const expirationTimeValue =
      new Date().getTime() -
      ACCOUNT_VERIFICATION_EXPIRATION_PERIOD_DAYS * 24 * 60 * 60 * 1000;

    const expirationDateString = convertISOToMysqlDateTime(
      new Date(expirationTimeValue).toISOString(),
    );

    await db
      .delete(users)
      .where(
        and(
          eq(users.emailVerified, 0),
          lte(users.createdAt, expirationDateString),
        ),
      );

    return true;
  } catch (error) {
    logger.error("Error deleting unverified accounts", error);
    return false;
  }
};

export const deleteExpiredEmailVerificationTokens = async () => {
  try {
    await emailVerificationCodeRepository.deleteExpiredCodes();
    return true;
  } catch (error) {
    logger.error("Error deleting expired email verification tokens", error);
    return false;
  }
};

export const updateCurrencyRates = async () => {
  try {
    const exchangeRatesResponse =
      await exchangeRatesService.getLatestExchangeRates();

    if (exchangeRatesResponse === null) return;

    const upsertResult = await currencyRatesRepository.upsertCurrencyRates(
      exchangeRatesResponse.rates,
    );

    if (!upsertResult) return;

    return true;
  } catch (error) {
    logger.error("Error updating currency rates", error);
  }
};
