import { env } from "@/env";
import logger from "@/lib/utils/logger";
import { exchangeRateResponseSchema } from "@/schemas/exchange-rate-response-schema";

export const getLatestExchangeRates = async () => {
  try {
    const endpoint = `https://openexchangerates.org/api/latest.json?app_id=${env.OPEN_EXCHANGE_RATE_APP_ID}&prettyprint=false&show_alternative=false`;
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    });
    const data = await response.json();

    const validatedResponse = exchangeRateResponseSchema.safeParse(data);

    if (!validatedResponse.success) {
      return null;
    }

    return validatedResponse.data;
  } catch (error) {
    logger.error("Error fetching exchange rates", error);
    return null;
  }
};
