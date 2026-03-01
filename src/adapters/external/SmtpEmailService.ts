import type { EmailService } from '../../core/ports/EmailService.js';

export class SmtpEmailService implements EmailService {
  async sendWelcomeEmail(): Promise<void> {
    // production adapter would call provider SDK
  }
}
