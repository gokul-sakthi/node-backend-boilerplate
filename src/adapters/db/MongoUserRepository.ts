import { MongoClient } from 'mongodb';

import type { User } from '../../core/entities/User.js';
import type { UserRepository } from '../../core/ports/UserRepository.js';

interface UserDoc {
  _id: string;
  email: string;
  fullName: string;
  createdAt: Date;
}

export class MongoUserRepository implements UserRepository {
  private readonly client: MongoClient;

  constructor(uri: string, private readonly dbName: string) {
    this.client = new MongoClient(uri);
  }

  private collection() {
    return this.client.db(this.dbName).collection<UserDoc>('users');
  }

  async connect(): Promise<void> {
    await this.client.connect();
    await this.collection().createIndex({ email: 1 }, { unique: true });
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await this.collection().findOne({ email: email.toLowerCase() });
    if (!doc) {
      return null;
    }

    return {
      id: doc._id,
      email: doc.email,
      fullName: doc.fullName,
      createdAt: doc.createdAt
    };
  }

  async create(user: User): Promise<void> {
    await this.collection().insertOne({
      _id: user.id,
      email: user.email,
      fullName: user.fullName,
      createdAt: user.createdAt
    });
  }

  async close(): Promise<void> {
    await this.client.close();
  }
}
