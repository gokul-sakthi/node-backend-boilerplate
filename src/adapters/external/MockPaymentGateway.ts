import type { PaymentGateway } from '../../core/ports/PaymentGateway.js';

export class MockPaymentGateway implements PaymentGateway {
  async authorizeInitialCredit(): Promise<string> {
    return 'mock-auth';
  }
}
