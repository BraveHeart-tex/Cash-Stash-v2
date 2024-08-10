import { LOG_COLORS } from "@/lib/constants";

enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

interface ILogger {
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}

class Logger implements ILogger {
  private log(level: LogLevel, ...args: unknown[]) {
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
        console.info(...args);
    }
  }

  debug(...args: unknown[]) {
    this.log(LogLevel.DEBUG, ...args);
  }

  info(...args: unknown[]) {
    this.log(LogLevel.INFO, ...args);
  }

  warn(...args: unknown[]) {
    this.log(LogLevel.WARN, ...args);
  }

  error(...args: unknown[]) {
    this.log(LogLevel.ERROR, ...args);
  }
}

const logger = new Logger();

export default logger;
