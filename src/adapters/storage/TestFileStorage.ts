import type { FileStorage } from '../../core/ports/FileStorage.js';

export class TestFileStorage implements FileStorage {
  public readonly files = new Map<string, string>();

  async putText(path: string, body: string): Promise<void> {
    this.files.set(path, body);
  }
}
