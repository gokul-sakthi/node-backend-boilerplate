export interface EventBus {
  publish(topic: string, payload: Record<string, unknown>): Promise<void>;
}
