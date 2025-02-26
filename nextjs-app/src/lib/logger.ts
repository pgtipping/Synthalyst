type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";
  private logLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) || "info";

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    };

    return levels[level] >= levels[this.logLevel];
  }

  private formatMessage(entry: LogEntry): string {
    const timestamp = new Date().toISOString();
    const dataString = entry.data
      ? `\nData: ${JSON.stringify(entry.data, null, 2)}`
      : "";
    return `[${timestamp}] ${entry.level.toUpperCase()}: ${
      entry.message
    }${dataString}`;
  }

  private log(level: LogLevel, message: string, data?: unknown) {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };

    const formattedMessage = this.formatMessage(entry);

    // Always log errors
    if (level === "error") {
      console.error(formattedMessage);
      // Here you could add error reporting service integration
      return;
    }

    // Log other levels based on environment and log level
    switch (level) {
      case "debug":
        console.debug(formattedMessage);
        break;
      case "info":
        console.info(formattedMessage);
        break;
      case "warn":
        console.warn(formattedMessage);
        break;
    }
  }

  debug(message: string, data?: unknown) {
    this.log("debug", message, data);
  }

  info(message: string, data?: unknown) {
    this.log("info", message, data);
  }

  warn(message: string, data?: unknown) {
    this.log("warn", message, data);
  }

  error(message: string, error?: Error | unknown) {
    const errorData =
      error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : error;

    this.log("error", message, errorData);
  }
}

export const logger = new Logger();
