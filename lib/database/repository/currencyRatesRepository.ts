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
};

export default currencyRatesRepository;
