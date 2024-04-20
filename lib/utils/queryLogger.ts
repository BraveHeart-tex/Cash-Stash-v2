import { Logger } from "drizzle-orm";

const RESET = "\x1b[0m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";

export default class QueryLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    console.log(`${YELLOW} QUERY: ${query} ${RESET}`);
    console.log(`${GREEN} PARAMS: ${JSON.stringify(params, null, 2)} ${RESET}`);
  }
}
