/**
 * Simple Logger Utility
 * 
 * Usage:
 *   logger.info('User logged in', { userId: '123' });
 *   logger.error('Failed to connect', error);
 *   logger.warn('Deprecated endpoint used');
 *   logger.debug('Query result', data);
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  [key: string]: any;
}

const colors = {
  info: '\x1b[36m',    // Cyan
  warn: '\x1b[33m',    // Yellow
  error: '\x1b[31m',   // Red
  debug: '\x1b[35m',   // Magenta
  reset: '\x1b[0m',    // Reset
};

const log = (level: LogLevel, message: string, context?: LogContext | Error) => {
  const timestamp = new Date().toISOString();
  const color = colors[level];
  const levelText = level.toUpperCase().padEnd(5);

  // Base log message
  console.log(`${color}[${timestamp}] ${levelText}${colors.reset} ${message}`);

  // Log context if provided
  if (context) {
    if (context instanceof Error) {
      console.log(`${color}Error:${colors.reset}`, context.message);
      if (context.stack) {
        console.log(context.stack);
      }
    } else {
      console.log(`${color}Context:${colors.reset}`, JSON.stringify(context, null, 2));
    }
  }
};

export const logger = {
  info: (message: string, context?: LogContext) => log('info', message, context),
  warn: (message: string, context?: LogContext) => log('warn', message, context),
  error: (message: string, error?: Error | LogContext) => log('error', message, error),
  debug: (message: string, context?: LogContext) => {
    // Only log debug in development
    if (process.env.NODE_ENV !== 'production') {
      log('debug', message, context);
    }
  },
};

export default logger;
