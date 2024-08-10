import { LOG_COLORS } from "@/lib/constants";
import type { Logger } from "drizzle-orm";

export default class QueryLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    console.info(`${LOG_COLORS.YELLOW} QUERY: ${query} ${LOG_COLORS.RESET}`);
    console.info(
      `${LOG_COLORS.GREEN} PARAMS: ${JSON.stringify(params, null, 2)} ${LOG_COLORS.RESET}`,
    );
  }
}
