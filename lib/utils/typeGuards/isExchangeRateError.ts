import { ExchangeRateResponseError } from "@/typings/exchangeRates";

export function isExchangeRateResponseError(
  data: any
): data is ExchangeRateResponseError {
  return data && typeof data.error === "string";
}
