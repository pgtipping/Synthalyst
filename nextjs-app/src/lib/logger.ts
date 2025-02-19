type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";

  private formatMessage(
    level: LogLevel,
    message: string,
    data?: unknown
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(data && { data }),
    };
  }

  private log(level: LogLevel, message: string, data?: unknown) {
    const logEntry = this.formatMessage(level, message, data);

    // In development, log to console with colors
    if (this.isDevelopment) {
      const colors = {
        debug: "\x1b[34m", // blue
        info: "\x1b[32m", // green
        warn: "\x1b[33m", // yellow
        error: "\x1b[31m", // red
        reset: "\x1b[0m",
      };

      console.log(
        `${colors[level]}[${logEntry.timestamp}] ${level.toUpperCase()}: ${
          logEntry.message
        }${colors.reset}`,
        logEntry.data ? "\n" + JSON.stringify(logEntry.data, null, 2) : ""
      );
      return;
    }

    // In production, format for log management service
    // TODO: Implement production logging service integration
    console.log(JSON.stringify(logEntry));
  }

  debug(message: string, data?: unknown) {
    if (this.isDevelopment) {
      this.log("debug", message, data);
    }
  }

  info(message: string, data?: unknown) {
    this.log("info", message, data);
  }

  warn(message: string, data?: unknown) {
    this.log("warn", message, data);
  }

  error(message: string, data?: unknown) {
    this.log("error", message, data);
  }
}

export const logger = new Logger();
