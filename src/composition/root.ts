import Fastify from 'fastify';

import { InMemoryUserRepository } from '../adapters/db/InMemoryUserRepository.js';
import { MongoUserRepository } from '../adapters/db/MongoUserRepository.js';
import { PostgresUserRepository } from '../adapters/db/PostgresUserRepository.js';
import { MemoryCacheStore } from '../adapters/cache/MemoryCacheStore.js';
import { InMemoryEventBus } from '../adapters/queue/InMemoryEventBus.js';
import { MockPaymentGateway } from '../adapters/external/MockPaymentGateway.js';
import { SmtpEmailService } from '../adapters/external/SmtpEmailService.js';
import { StripePaymentGateway } from '../adapters/external/StripePaymentGateway.js';
import { LocalFileStorage } from '../adapters/storage/LocalFileStorage.js';
import { PinoLikeLogger } from '../adapters/http/PinoLikeLogger.js';
import { RegisterUserUseCase } from '../core/usecases/RegisterUserUseCase.js';
import type { UserRepository } from '../core/ports/UserRepository.js';
import type { AppConfig } from '../config/env.js';
import { UserController } from '../interfaces/http/UserController.js';
import { registerRoutes } from '../interfaces/http/routes.js';

const randomId = (): string => crypto.randomUUID();

export interface AppRuntime {
  app: ReturnType<typeof Fastify>;
  start: () => Promise<void>;
  stop: () => Promise<void>;
}

export const createApp = async (config: AppConfig): Promise<AppRuntime> => {
  const logger = new PinoLikeLogger();

  let userRepository: UserRepository;
  let closeRepo: (() => Promise<void>) | undefined;

  if (config.DB_DRIVER === 'postgres') {
    const repo = new PostgresUserRepository(config.POSTGRES_URL);
    await repo.migrate();
    userRepository = repo;
    closeRepo = () => repo.close();
  } else if (config.DB_DRIVER === 'mongo') {
    const repo = new MongoUserRepository(config.MONGO_URL, config.MONGO_DB_NAME);
    await repo.connect();
    userRepository = repo;
    closeRepo = () => repo.close();
  } else {
    userRepository = new InMemoryUserRepository();
  }

  const paymentGateway = config.PAYMENT_PROVIDER === 'stripe' ? new StripePaymentGateway() : new MockPaymentGateway();

  const registerUserUseCase = new RegisterUserUseCase({
    userRepository,
    paymentGateway,
    emailService: new SmtpEmailService(),
    cacheStore: new MemoryCacheStore(),
    fileStorage: new LocalFileStorage(config.STORAGE_ROOT),
    eventBus: new InMemoryEventBus(),
    logger,
    idGenerator: randomId,
    now: () => new Date()
  });

  const userController = new UserController(registerUserUseCase);

  const app = Fastify();
  registerRoutes(app, userController);

  return {
    app,
    start: async () => {
      await app.listen({ port: config.PORT, host: '0.0.0.0' });
      logger.info('HTTP server started', { port: config.PORT });
    },
    stop: async () => {
      await app.close();
      if (closeRepo) {
        await closeRepo();
      }
    }
  };
};
