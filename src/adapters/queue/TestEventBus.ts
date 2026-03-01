import type { EventBus } from '../../core/ports/EventBus.js';

export class TestEventBus implements EventBus {
  public readonly events: Array<{ topic: string; payload: Record<string, unknown> }> = [];

  async publish(topic: string, payload: Record<string, unknown>): Promise<void> {
    this.events.push({ topic, payload });
  }
}
