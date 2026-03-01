import type { RegisterUserCommand, User } from '../entities/User.js';
import { DuplicateUserError } from '../errors/DomainError.js';
import type { CacheStore } from '../ports/CacheStore.js';
import type { EmailService } from '../ports/EmailService.js';
import type { EventBus } from '../ports/EventBus.js';
import type { FileStorage } from '../ports/FileStorage.js';
import type { Logger } from '../ports/Logger.js';
import type { PaymentGateway } from '../ports/PaymentGateway.js';
import type { UserRepository } from '../ports/UserRepository.js';

export interface RegisterUserUseCaseDeps {
  userRepository: UserRepository;
  paymentGateway: PaymentGateway;
  emailService: EmailService;
  cacheStore: CacheStore;
  fileStorage: FileStorage;
  eventBus: EventBus;
  logger: Logger;
  idGenerator: () => string;
  now: () => Date;
}

export class RegisterUserUseCase {
  constructor(private readonly deps: RegisterUserUseCaseDeps) {}

  async execute(command: RegisterUserCommand): Promise<User> {
    const existing = await this.deps.userRepository.findByEmail(command.email);
    if (existing) {
      throw new DuplicateUserError(command.email);
    }

    const user: User = {
      id: this.deps.idGenerator(),
      email: command.email.toLowerCase(),
      fullName: command.fullName,
      createdAt: this.deps.now()
    };

    await this.deps.paymentGateway.authorizeInitialCredit({
      userId: user.id,
      amountCents: command.initialCreditCents
    });
    await this.deps.userRepository.create(user);
    await this.deps.cacheStore.set(`user:${user.id}`, JSON.stringify(user), 3600);
    await this.deps.fileStorage.putText(
      `audit/users/${user.id}.json`,
      JSON.stringify({ userId: user.id, action: 'REGISTERED' })
    );
    await this.deps.emailService.sendWelcomeEmail({ email: user.email, fullName: user.fullName });
    await this.deps.eventBus.publish('user.registered', { userId: user.id, email: user.email });

    this.deps.logger.info('User registered', { userId: user.id });

    return user;
  }
}
