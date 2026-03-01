import type { CacheStore } from '../../core/ports/CacheStore.js';

export class MockCacheStore implements CacheStore {
  async set(): Promise<void> {}

  async get(): Promise<string | null> {
    return null;
  }
}
