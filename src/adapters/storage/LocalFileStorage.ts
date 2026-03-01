import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

import type { FileStorage } from '../../core/ports/FileStorage.js';

export class LocalFileStorage implements FileStorage {
  constructor(private readonly root: string) {}

  async putText(path: string, body: string): Promise<void> {
    const fullPath = join(this.root, path);
    await mkdir(dirname(fullPath), { recursive: true });
    await writeFile(fullPath, body, 'utf8');
  }
}
