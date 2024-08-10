import { db } from "@/lib/database/connection";
import {
  type CurrencyRateInsertModel,
  currencyRates,
} from "@/lib/database/schema";
import logger from "@/lib/utils/logger";
import { eq } from "drizzle-orm";

const currencyRatesRepository = {
  async updateCurrencyRate(rateToUpdate: CurrencyRateInsertModel) {
    const { symbol, rate } = rateToUpdate;
    return await db
      .insert(currencyRates)
      .values({
        symbol,
        rate,
      })
      .onDuplicateKeyUpdate({
        set: {
          rate,
        },
      });
  },
  async getCurrencyRateBySymbol(symbol: string) {
    const [currencyRate] = await db
      .select()
      .from(currencyRates)
      .where(eq(currencyRates.symbol, symbol));

    return currencyRate;
  },

  async getCurrencyRates() {
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
  },
};

export default currencyRatesRepository;
