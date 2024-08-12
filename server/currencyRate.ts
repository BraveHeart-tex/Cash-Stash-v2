"use server";

import { authenticatedAction } from "@/lib/auth/authUtils";
import { CURRENCIES } from "@/lib/constants";
import * as currencyRatesRepository from "@/lib/database/repository/currencyRatesRepository";
import logger from "@/lib/utils/logger";
import { getTranslatedLabelForCurrency } from "@/lib/utils/translationUtils/getTranslatedLabelForCurrency";
import type { ConvertCurrencyType } from "@/typings/currencies";
import { getTranslations } from "next-intl/server";

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
    const mappedAmount = Number.parseFloat(amount || "1");

    const getExchangeRate = (symbol: string) => currencyRates[symbol] || null;

    const convertCurrency = (
      amount: number,
      fromCurrency: string,
      toCurrency: string,
    ) => {
      const fromRate = getExchangeRate(fromCurrency);
      const toRate = getExchangeRate(toCurrency);

      if (!fromRate || !toRate) {
        return null;
      }

      return (amount / fromRate) * toRate;
    };

    for (const currencyRate in currencyRates) {
      if (Object.hasOwn(currencyRates, currencyRate)) {
        const convertedAmount = convertCurrency(
          mappedAmount,
          currency,
          currencyRate,
        );

        if (convertedAmount) {
          convertedAmounts[currencyRate] = convertedAmount;
        }
      }
    }

    const t = await getTranslations("Lists");

    const mappedCurrencies = Object.entries(convertedAmounts).map(
      ([key, value]) => {
        const label =
          CURRENCIES.find((item) => item.symbol === key)?.name || key;
        const translatedLabel = getTranslatedLabelForCurrency(t, key);

        return {
          symbol: key,
          rate: currencyRates[key],
          label: translatedLabel || label,
          amount: value,
        };
      },
    );

    return {
      currencies: mappedCurrencies,
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
