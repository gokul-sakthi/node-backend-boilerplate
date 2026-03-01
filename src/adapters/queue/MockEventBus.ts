import type { EventBus } from '../../core/ports/EventBus.js';

export class MockEventBus implements EventBus {
  async publish(): Promise<void> {}
}
