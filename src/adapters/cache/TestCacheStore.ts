import type { CacheStore } from '../../core/ports/CacheStore.js';

export class TestCacheStore implements CacheStore {
  public readonly records = new Map<string, string>();

  async set(key: string, value: string): Promise<void> {
    this.records.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return this.records.get(key) ?? null;
  }
}
