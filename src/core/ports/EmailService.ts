export interface EmailService {
  sendWelcomeEmail(input: { email: string; fullName: string }): Promise<void>;
}
