import { LOG_COLORS } from "../constants";

interface ILogger {
  // eslint-disable-next-line no-unused-vars
  error: (message: string) => void;
  // eslint-disable-next-line no-unused-vars
  info: (message: string) => void;
  // eslint-disable-next-line no-unused-vars
  message: (message: string) => void;
}

class Logger implements ILogger {
  error(message: string) {
    console.error(`${LOG_COLORS.RED} ${message} ${LOG_COLORS.RESET}`);
  }

  info(message: string) {
    console.info(`${LOG_COLORS.CYAN} ${message} ${LOG_COLORS.RESET}`);
  }

  message(message: string) {
    console.log(`${LOG_COLORS.BLUE} ${message} ${LOG_COLORS.RESET}`);
  }
}

const logger = new Logger();

export default logger;
