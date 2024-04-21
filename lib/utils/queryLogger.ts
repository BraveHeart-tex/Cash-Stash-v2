import { Logger } from "drizzle-orm";
import { LOG_COLORS } from "../constants";

export default class QueryLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    console.log(`${LOG_COLORS.YELLOW} QUERY: ${query} ${LOG_COLORS.RESET}`);
    console.log(
      `${LOG_COLORS.GREEN} PARAMS: ${JSON.stringify(params, null, 2)} ${LOG_COLORS.RESET}`
    );
  }
}
