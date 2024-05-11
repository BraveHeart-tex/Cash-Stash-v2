"use server";

import { CURRENCIES } from "@/lib/constants";
import currencyRatesRepository from "@/lib/database/repository/currencyRatesRepository";
import logger from "@/lib/utils/logger";
import { ConvertCurrencyType } from "@/typings/currencies";
import { authenticatedAction } from "@/lib/auth/authUtils";

type ConvertCurrencyParams = {
  currency: string;
  amount: string;
};

type ConvertCurrencyReturnType = {
  currencies: ConvertCurrencyType[];
  updatedAt: string;
  error?: string;
};

export const convertCurrency = authenticatedAction<
  ConvertCurrencyReturnType,
  ConvertCurrencyParams
>(async ({ currency, amount }) => {
  try {
    const currencyRates = await currencyRatesRepository.getCurrencyRates();
    const convertedAmounts: { [key: string]: number } = {};
    const mappedAmount = parseFloat(amount || "1");

    const getExchangeRate = (symbol: string) => currencyRates[symbol] || null;

    const convertCurrency = (
      amount: number,
      fromCurrency: string,
      toCurrency: string
    ) => {
      const fromRate = getExchangeRate(fromCurrency);
      const toRate = getExchangeRate(toCurrency);

      if (!fromRate || !toRate) {
        return null;
      }

      return (amount / fromRate) * toRate;
    };

    for (const currencyRate in currencyRates) {
      if (currencyRates.hasOwnProperty(currencyRate)) {
        const convertedAmount = convertCurrency(
          mappedAmount,
          currency,
          currencyRate
        );

        if (convertedAmount) {
          convertedAmounts[currencyRate] = convertedAmount;
        }
      }
    }

    return {
      currencies: Object.entries(convertedAmounts).map(([key, value]) => {
        return {
          symbol: key,
          rate: currencyRates[key],
          label: CURRENCIES.find((item) => item.symbol === key)?.name || "",
          amount: value,
        };
      }),
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    logger.error("Error converting currency", error);
    return {
      currencies: [],
      updatedAt: new Date().toISOString(),
    };
  }
});
