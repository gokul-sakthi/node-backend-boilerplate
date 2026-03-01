import type { EmailService } from '../../core/ports/EmailService.js';

export class MockEmailService implements EmailService {
  async sendWelcomeEmail(): Promise<void> {
    // no-op
  }
}
