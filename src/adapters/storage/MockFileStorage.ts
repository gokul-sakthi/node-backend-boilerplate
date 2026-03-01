import type { FileStorage } from '../../core/ports/FileStorage.js';

export class MockFileStorage implements FileStorage {
  async putText(): Promise<void> {}
}
