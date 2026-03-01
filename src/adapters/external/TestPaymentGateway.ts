import type { PaymentGateway } from '../../core/ports/PaymentGateway.js';

export class TestPaymentGateway implements PaymentGateway {
  public readonly calls: Array<{ userId: string; amountCents: number }> = [];

  async authorizeInitialCredit(input: { userId: string; amountCents: number }): Promise<string> {
    this.calls.push(input);
    return 'test-auth';
  }
}
