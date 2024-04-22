/* eslint-disable no-unused-vars */
import { LOG_COLORS } from "@/lib/constants";

// Define log levels
enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

interface ILogger {
  debug: (...args: any[]) => void;
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
}

class Logger implements ILogger {
  private log(level: LogLevel, ...args: any[]) {
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(`${LOG_COLORS.GREEN}[DEBUG]`, ...args, LOG_COLORS.RESET);
        break;
      case LogLevel.INFO:
        console.info(`${LOG_COLORS.CYAN}[INFO]`, ...args, LOG_COLORS.RESET);
        break;
      case LogLevel.WARN:
        console.warn(`${LOG_COLORS.YELLOW}[WARN]`, ...args, LOG_COLORS.RESET);
        break;
      case LogLevel.ERROR:
        console.error(`${LOG_COLORS.RED}[ERROR]`, ...args, LOG_COLORS.RESET);
        break;
      default:
        console.log(...args);
    }
  }

  debug(...args: any[]) {
    this.log(LogLevel.DEBUG, ...args);
  }

  info(...args: any[]) {
    this.log(LogLevel.INFO, ...args);
  }

  warn(...args: any[]) {
    this.log(LogLevel.WARN, ...args);
  }

  error(...args: any[]) {
    this.log(LogLevel.ERROR, ...args);
  }
}

const logger = new Logger();

export default logger;
