"use server";

import { getUser } from "@/lib/auth/session";
import { CURRENCIES, PAGE_ROUTES } from "@/lib/constants";
import currencyRatesRepository from "@/lib/database/repository/currencyRatesRepository";
import { redirect } from "next/navigation";
import { ConvertCurrencyType } from "./types";

interface IConvertCurrencyParams {
  currency: string;
  amount: string;
}

interface IConvertCurrencyReturnType {
  currencies: ConvertCurrencyType[];
  updatedAt: string;
  error?: string;
}

export const convertCurrency = async ({
  currency,
  amount,
}: IConvertCurrencyParams): Promise<IConvertCurrencyReturnType> => {
  const { user } = await getUser();

  if (!user) {
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  try {
    const currencyRates = await currencyRatesRepository.getCurrencyRates();
    const convertedAmounts: { [key: string]: number } = {};
    const mappedAmount = Number(amount || "1");

    for (const currencyRate in currencyRates) {
      if (currencyRates.hasOwnProperty(currencyRate)) {
        const rate = currencyRates[currencyRate];

        const convertedAmount =
          currencyRate === currency ? mappedAmount : mappedAmount * rate;
        convertedAmounts[currencyRate] = convertedAmount;
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
    console.error("Error converting currency", error);
    return {
      currencies: [],
      updatedAt: new Date().toISOString(),
    };
  }
};
