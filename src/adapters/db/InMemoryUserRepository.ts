import type { User } from '../../core/entities/User.js';
import type { UserRepository } from '../../core/ports/UserRepository.js';

export class InMemoryUserRepository implements UserRepository {
  private readonly usersByEmail = new Map<string, User>();

  async findByEmail(email: string): Promise<User | null> {
    return this.usersByEmail.get(email.toLowerCase()) ?? null;
  }

  async create(user: User): Promise<void> {
    this.usersByEmail.set(user.email.toLowerCase(), user);
  }
}
