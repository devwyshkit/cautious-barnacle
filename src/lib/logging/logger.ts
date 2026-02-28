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
  vendorId?: string;
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
    // WYSHKIT 2026: God Level Purity. 
    // Absolute production-grade silence. Only ERRORs reach the stream in non-development.
    // In development, we use WARN to keep the DX clean.
    this.minLevel = this.isDevelopment ? LogLevel.WARN : LogLevel.ERROR;
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
    // In development, we use full verbosity for DX.
    if (this.isDevelopment) {
      const prefix = `[${entry.level.toUpperCase()}]`;
      const contextStr = entry.context ? ` | Context: ${JSON.stringify(entry.context)}` : '';
      const errorStr = entry.error ? ` | Error: ${entry.error.name}: ${entry.error.message}` : '';
      const metadataStr = entry.metadata ? ` | Metadata: ${JSON.stringify(entry.metadata)}` : '';

      // Clean single-line log for dev console
      console.log(`${prefix} ${entry.message}${contextStr}${errorStr}${metadataStr}`);

      if (entry.error?.stack) {
        console.error(entry.error.stack);
      }
    } else {
      // In production, output structured JSON for log aggregation (e.g., Datadog, Pino style)
      // We ONLY emit logs for levels that meet the minimum threshold (WARN/ERROR by default)
      if (entry.level === LogLevel.ERROR || entry.level === LogLevel.WARN) {
        // Use console.log for structured logs (supported in Node and Edge)
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
