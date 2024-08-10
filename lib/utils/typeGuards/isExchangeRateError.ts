import type { ExchangeRateResponseError } from "@/typings/exchangeRates";

export function isExchangeRateResponseError(
  data: Record<string, unknown>,
): data is ExchangeRateResponseError {
  return data && typeof data.error === "string";
}
