/**
 * Structured Logging Service
 * Wyshkit 2026: Production-grade logging with context, levels, and observability
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface LogContext {
  userId?: string;
  requestId?: string;
  orderId?: string;
  partnerId?: string;
  action?: string;
  [key: string]: unknown;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  metadata?: Record<string, unknown>;
}

class Logger {
  private minLevel: LogLevel;
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    // In production, only log WARN and above
    this.minLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.WARN;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    return levels.indexOf(level) >= levels.indexOf(this.minLevel);
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error,
    metadata?: Record<string, unknown>
  ): LogEntry {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      metadata,
    };

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: this.isDevelopment ? error.stack : undefined,
      };
    }

    return entry;
  }

  private log(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) {
      return;
    }

    // WYSHKIT 2026: Zero Console Leak Enforcement
    // In production, we ONLY log to standard output if log level is ERROR or WARN.
    // In development, we use full verbosity.
    if (this.isDevelopment) {
      const prefix = `[${entry.level.toUpperCase()}]`;
      const contextStr = entry.context ? JSON.stringify(entry.context, null, 2) : '';
      const errorStr = entry.error ? `\nError: ${entry.error.name}: ${entry.error.message}` : '';
      const metadataStr = entry.metadata ? `\nMetadata: ${JSON.stringify(entry.metadata, null, 2)}` : '';

      console.log(`${prefix} ${entry.message}${contextStr}${errorStr}${metadataStr}`);

      if (entry.error?.stack) {
        console.error(entry.error.stack);
      }
    } else {
      // In production, output structured JSON for log aggregation (e.g., Datadog, Pino style)
      // Only log if level is WARN or ERROR to keep logs clean and fast
      if (entry.level === LogLevel.ERROR || entry.level === LogLevel.WARN) {
        console.log(JSON.stringify(entry));
      }
    }
  }

  debug(message: string, context?: LogContext, metadata?: Record<string, unknown>): void {
    this.log(this.createLogEntry(LogLevel.DEBUG, message, context, undefined, metadata));
  }

  info(message: string, context?: LogContext, metadata?: Record<string, unknown>): void {
    this.log(this.createLogEntry(LogLevel.INFO, message, context, undefined, metadata));
  }

  warn(message: string, context?: LogContext, metadata?: Record<string, unknown>): void {
    this.log(this.createLogEntry(LogLevel.WARN, message, context, undefined, metadata));
  }

  error(
    message: string,
    error?: Error | unknown,
    context?: LogContext,
    metadata?: Record<string, unknown>
  ): void {
    const err = error instanceof Error ? error : undefined;
    if (!err && error) {
      // Convert unknown error to Error
      const errorMessage = typeof error === 'string'
        ? error
        : (error && typeof error === 'object' && 'message' in error)
          ? String(error.message)
          : JSON.stringify(error) || 'Unknown error';
      const errObj = new Error(errorMessage);
      this.log(this.createLogEntry(LogLevel.ERROR, message, context, errObj, metadata));
    } else {
      this.log(this.createLogEntry(LogLevel.ERROR, message, context, err, metadata));
    }
  }

  // Convenience methods for common scenarios
  logAction(action: string, context?: LogContext, metadata?: Record<string, unknown>): void {
    const fullContext = {
      ...context,
      action,
      env: this.isDevelopment ? 'dev' : 'prod'
    };
    this.info(`[ACTION] ${action}`, fullContext, metadata);
  }

  logAPIRequest(method: string, path: string, context?: LogContext): void {
    this.info(`[API] ${method} ${path}`, { ...context, method, path });
  }

  logOrderEvent(event: string, orderId: string, context?: LogContext): void {
    this.info(`[ORDER] ${event}`, { ...context, orderId, event });
  }

  logPerformance(operation: string, duration: number, context?: LogContext): void {
    this.info(`[PERF] ${operation} took ${duration}ms`, context, { duration, operation });
  }
}

// Singleton instance
export const logger = new Logger();

// Export convenience functions
export const log = {
  debug: (message: string, context?: LogContext, metadata?: Record<string, unknown>) =>
    logger.debug(message, context, metadata),
  info: (message: string, context?: LogContext, metadata?: Record<string, unknown>) =>
    logger.info(message, context, metadata),
  warn: (message: string, context?: LogContext, metadata?: Record<string, unknown>) =>
    logger.warn(message, context, metadata),
  error: (message: string, error?: Error | unknown, context?: LogContext, metadata?: Record<string, unknown>) =>
    logger.error(message, error, context, metadata),
  action: (action: string, context?: LogContext, metadata?: Record<string, unknown>) =>
    logger.logAction(action, context, metadata),
  api: (method: string, path: string, context?: LogContext) =>
    logger.logAPIRequest(method, path, context),
  order: (event: string, orderId: string, context?: LogContext) =>
    logger.logOrderEvent(event, orderId, context),
  performance: (operation: string, duration: number, context?: LogContext) =>
    logger.logPerformance(operation, duration, context),
};
