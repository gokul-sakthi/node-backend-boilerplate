import { Kysely, PostgresDialect, sql } from 'kysely';
import pg from 'pg';

import type { User } from '../../core/entities/User.js';
import type { UserRepository } from '../../core/ports/UserRepository.js';

interface UserTable {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}

interface DbSchema {
  users: UserTable;
}

export class PostgresUserRepository implements UserRepository {
  private readonly db: Kysely<DbSchema>;

  constructor(connectionString: string) {
    this.db = new Kysely<DbSchema>({
      dialect: new PostgresDialect({
        pool: new pg.Pool({ connectionString })
      })
    });
  }

  async migrate(): Promise<void> {
    await sql`
      create table if not exists users (
        id text primary key,
        email text unique not null,
        full_name text not null,
        created_at timestamptz not null
      )
    `.execute(this.db);
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.db
      .selectFrom('users')
      .selectAll()
      .where('email', '=', email.toLowerCase())
      .executeTakeFirst();

    if (!row) {
      return null;
    }

    return {
      id: row.id,
      email: row.email,
      fullName: row.full_name,
      createdAt: new Date(row.created_at)
    };
  }

  async create(user: User): Promise<void> {
    await this.db
      .insertInto('users')
      .values({
        id: user.id,
        email: user.email,
        full_name: user.fullName,
        created_at: user.createdAt.toISOString()
      })
      .executeTakeFirst();
  }

  async close(): Promise<void> {
    await this.db.destroy();
  }
}
