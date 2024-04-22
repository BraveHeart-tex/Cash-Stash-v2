import { ACCOUNT_VERIFICATION_EXPIRATION_PERIOD_DAYS } from "@/lib/constants";
import { db } from "@/lib/database/connection";
import { users } from "@/lib/database/schema";
import { and, eq, lte } from "drizzle-orm";
import { convertISOToMysqlDatetime } from "@/lib/utils/dateUtils/convertISOToMysqlDatetime";
import { isExchangeRateResponse } from "@/lib/utils/typeGuards/isExchangeRateResponse";
import { isExchangeRateResponseError } from "@/lib/utils/typeGuards/isExchangeRateError";
import currencyRatesRepository from "@/lib/database/repository/currencyRatesRepository";
import exchangeRatesService from "@/lib/services/exchangeRatesService";
import emailVerificationCodeRepository from "@/lib/database/repository/emailVerificationCodeRepository";

const cronService = {
  async deleteUnverifiedAccounts() {
    try {
      const expirationTimeValue =
        new Date().getTime() -
        ACCOUNT_VERIFICATION_EXPIRATION_PERIOD_DAYS * 24 * 60 * 60 * 1000;

      const expirationDateString = convertISOToMysqlDatetime(
        new Date(expirationTimeValue).toISOString()
      );

      await db
        .delete(users)
        .where(
          and(
            eq(users.emailVerified, 0),
            lte(users.createdAt, expirationDateString)
          )
        );

      return true;
    } catch (error) {
      console.error("Error deleting unverified accounts", error);
      return false;
    }
  },
  async deleteExpiredEmailVerificationTokens() {
    try {
      await emailVerificationCodeRepository.deleteExpiredCodes();
      return true;
    } catch (error) {
      console.error("Error deleting expired email verification tokens", error);
      return false;
    }
  },
  async updateCurrencyRates() {
    try {
      const data = await exchangeRatesService.getLatestRates();

      if (isExchangeRateResponse(data)) {
        const mappedRates = Object.entries(data.rates).map(
          ([currency, rate]) => {
            return {
              symbol: currency,
              rate,
            };
          }
        );

        const upsertPromises = mappedRates.map(({ symbol, rate }) =>
          currencyRatesRepository.updateCurrencyRate({ symbol, rate })
        );

        await Promise.all(upsertPromises);

        return true;
      } else if (isExchangeRateResponseError(data)) {
        console.error("Error updating currency rates", data.description);
        return false;
      } else {
        console.error("Error updating currency rates");
        return false;
      }
    } catch (error) {
      console.error("Error updating currency rates", error);
      return false;
    }
  },
};

export default cronService;
