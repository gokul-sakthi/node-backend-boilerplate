import type { EventBus } from '../../core/ports/EventBus.js';

export class InMemoryEventBus implements EventBus {
  async publish(): Promise<void> {
    // production bus adapter would publish to queue
  }
}
