import { eq } from "drizzle-orm";
import { db } from "../connection";
import { CurrencyRateInsertModel, currencyRates } from "../schema";

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
};

export default currencyRatesRepository;
