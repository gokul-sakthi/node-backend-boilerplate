import type { Logger } from '../../core/ports/Logger.js';

export class MockLogger implements Logger {
  info(): void {}
  error(): void {}
}
