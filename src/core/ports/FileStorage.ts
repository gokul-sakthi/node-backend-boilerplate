export interface FileStorage {
  putText(path: string, body: string): Promise<void>;
}
