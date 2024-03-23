import { ExchangeRateResponse } from "@/actions/types";

export function isExchangeRateResponse(
  data: any
): data is ExchangeRateResponse {
  return (
    data && typeof data.base === "string" && typeof data.rates === "object"
  );
}
