import type { PaymentGateway } from '../../core/ports/PaymentGateway.js';

export class StripePaymentGateway implements PaymentGateway {
  async authorizeInitialCredit(input: { userId: string; amountCents: number }): Promise<string> {
    return `stripe-auth-${input.userId}-${input.amountCents}`;
  }
}
