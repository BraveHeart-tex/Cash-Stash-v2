import type { ExchangeRateResponse } from "@/typings/exchangeRates";

export function isExchangeRateResponse(
  data: Record<string, unknown>,
): data is ExchangeRateResponse {
  return (
    data && typeof data.base === "string" && typeof data.rates === "object"
  );
}
