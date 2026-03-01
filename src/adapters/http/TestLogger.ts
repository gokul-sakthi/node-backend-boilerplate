import type { Logger } from '../../core/ports/Logger.js';

export class TestLogger implements Logger {
  public readonly infos: Array<{ message: string; context?: Record<string, unknown> }> = [];

  info(message: string, context?: Record<string, unknown>): void {
    this.infos.push({ message, context });
  }

  error(): void {}
}
