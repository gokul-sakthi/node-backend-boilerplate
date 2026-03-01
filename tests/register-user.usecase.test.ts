import { describe, expect, it } from 'vitest';

import { InMemoryUserRepository } from '../src/adapters/db/InMemoryUserRepository.js';
import { TestCacheStore } from '../src/adapters/cache/TestCacheStore.js';
import { TestEmailService } from '../src/adapters/external/TestEmailService.js';
import { TestPaymentGateway } from '../src/adapters/external/TestPaymentGateway.js';
import { TestEventBus } from '../src/adapters/queue/TestEventBus.js';
import { TestFileStorage } from '../src/adapters/storage/TestFileStorage.js';
import { TestLogger } from '../src/adapters/http/TestLogger.js';
import { RegisterUserUseCase } from '../src/core/usecases/RegisterUserUseCase.js';

describe('RegisterUserUseCase', () => {
  it('registers a user without infrastructure', async () => {
    const payment = new TestPaymentGateway();
    const email = new TestEmailService();
    const cache = new TestCacheStore();
    const files = new TestFileStorage();
    const events = new TestEventBus();

    const useCase = new RegisterUserUseCase({
      userRepository: new InMemoryUserRepository(),
      paymentGateway: payment,
      emailService: email,
      cacheStore: cache,
      fileStorage: files,
      eventBus: events,
      logger: new TestLogger(),
      idGenerator: () => 'user-1',
      now: () => new Date('2025-01-01T00:00:00.000Z')
    });

    const user = await useCase.execute({
      email: 'test@example.com',
      fullName: 'Terry Architect',
      initialCreditCents: 500
    });

    expect(user.id).toBe('user-1');
    expect(payment.calls).toHaveLength(1);
    expect(email.sent[0]?.email).toBe('test@example.com');
    expect(cache.records.get('user:user-1')).toContain('Terry Architect');
    expect(files.files.get('audit/users/user-1.json')).toContain('REGISTERED');
    expect(events.events[0]?.topic).toBe('user.registered');
  });
});
