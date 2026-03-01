export interface PaymentGateway {
  authorizeInitialCredit(input: { userId: string; amountCents: number }): Promise<string>;
}
