import { ExchangeRateResponseError } from "@/server/types";

export function isExchangeRateResponseError(
  data: any
): data is ExchangeRateResponseError {
  return data && typeof data.error === "string";
}
