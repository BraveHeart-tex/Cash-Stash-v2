import { ExchangeRateResponse } from "@/typings/exchangeRates";

export function isExchangeRateResponse(
  data: any
): data is ExchangeRateResponse {
  return (
    data && typeof data.base === "string" && typeof data.rates === "object"
  );
}
