import { describe, expect, it } from 'vitest';
import { Kysely, PostgresDialect, sql } from 'kysely';
import { newDb } from 'pg-mem';

import type { User } from '../src/core/entities/User.js';

describe('Postgres adapter SQL contract', () => {
  it('persists and fetches rows using postgres dialect', async () => {
    const mem = newDb();
    const { Pool } = mem.adapters.createPg();

    interface UsersTable {
      id: string;
      email: string;
      full_name: string;
      created_at: string;
    }

    interface Db {
      users: UsersTable;
    }

    const db = new Kysely<Db>({
      dialect: new PostgresDialect({
        pool: new Pool()
      })
    });

    await sql`
      create table users (
        id text primary key,
        email text unique not null,
        full_name text not null,
        created_at timestamptz not null
      )
    `.execute(db);

    const user: User = {
      id: 'u-1',
      email: 'postgres@example.com',
      fullName: 'Postgres User',
      createdAt: new Date('2025-01-01T00:00:00.000Z')
    };

    await db
      .insertInto('users')
      .values({
        id: user.id,
        email: user.email,
        full_name: user.fullName,
        created_at: user.createdAt.toISOString()
      })
      .executeTakeFirst();

    const row = await db.selectFrom('users').selectAll().where('email', '=', user.email).executeTakeFirst();

    expect(row?.full_name).toBe('Postgres User');
    await db.destroy();
  });
});
