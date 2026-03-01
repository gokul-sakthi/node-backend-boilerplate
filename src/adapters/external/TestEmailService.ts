import type { EmailService } from '../../core/ports/EmailService.js';

export class TestEmailService implements EmailService {
  public readonly sent: Array<{ email: string; fullName: string }> = [];

  async sendWelcomeEmail(input: { email: string; fullName: string }): Promise<void> {
    this.sent.push(input);
  }
}
