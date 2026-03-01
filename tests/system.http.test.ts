import { afterAll, describe, expect, it } from 'vitest';

import { createApp } from '../src/composition/root.js';

const runtime = await createApp({
  NODE_ENV: 'test',
  PORT: 3999,
  DB_DRIVER: 'memory',
  POSTGRES_URL: 'postgres://ignored',
  MONGO_URL: 'mongodb://ignored',
  MONGO_DB_NAME: 'ignored',
  PAYMENT_PROVIDER: 'mock',
  STORAGE_ROOT: '.test-data'
});

describe('HTTP system', () => {
  afterAll(async () => {
    await runtime.stop();
  });

  it('registers a user via HTTP', async () => {
    const response = await runtime.app.inject({
      method: 'POST',
      url: '/users/register',
      payload: {
        email: 'http@example.com',
        fullName: 'Http User',
        initialCreditCents: 1000
      }
    });

    expect(response.statusCode).toBe(201);
    expect(response.json().email).toBe('http@example.com');
  });
});
