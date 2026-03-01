export type UserId = string;

export interface User {
  id: UserId;
  email: string;
  fullName: string;
  createdAt: Date;
}

export interface RegisterUserCommand {
  email: string;
  fullName: string;
  initialCreditCents: number;
}
