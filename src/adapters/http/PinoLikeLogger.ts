import type { Logger } from '../../core/ports/Logger.js';

export class PinoLikeLogger implements Logger {
  info(message: string, context?: Record<string, unknown>): void {
    process.stdout.write(`${JSON.stringify({ level: 'info', message, ...context })}\n`);
  }

  error(message: string, context?: Record<string, unknown>): void {
    process.stderr.write(`${JSON.stringify({ level: 'error', message, ...context })}\n`);
  }
}
