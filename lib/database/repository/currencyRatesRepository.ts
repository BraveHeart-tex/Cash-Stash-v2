import { db } from "@/lib/database/connection";
import { currencyRates } from "@/lib/database/schema";
import logger from "@/lib/utils/logger";
import type {
  ExchangeRateResponse,
  RateSymbol,
} from "@/schemas/exchange-rate-response-schema";
import { eq, sql } from "drizzle-orm";

export const upsertCurrencyRates = async (
  currencyRatesData: ExchangeRateResponse["rates"],
) => {
  try {
    const upsertPayload = Object.entries(currencyRatesData).map(
      ([symbol, rate]) => {
        return {
          symbol,
          rate,
        };
      },
    );

    await db
      .insert(currencyRates)
      .values(upsertPayload)
      .onDuplicateKeyUpdate({
        set: {
          rate: sql`VALUES(rate)`,
        },
      });

    return true;
  } catch (error) {
    logger.error("Error upserting currency rates", error);
  }
};

export const getCurrencyRateBySymbol = async (currencySymbol: RateSymbol) => {
  return db.query.currencyRates.findFirst({
    where: () => eq(currencyRates.symbol, currencySymbol),
  });
};

export const getCurrencyRates = async () => {
  try {
    return (await db.select().from(currencyRates)).reduce(
      (acc, curr) => {
        acc[curr.symbol] = curr.rate;
        return acc;
      },
      {} as Record<string, number>,
    );
  } catch (error) {
    logger.error("Error getting currency rates", error);
    return {};
  }
};
