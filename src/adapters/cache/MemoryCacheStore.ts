import type { CacheStore } from '../../core/ports/CacheStore.js';

export class MemoryCacheStore implements CacheStore {
  private readonly store = new Map<string, string>();

  async set(key: string, value: string): Promise<void> {
    this.store.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return this.store.get(key) ?? null;
  }
}
