export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}

export class DuplicateUserError extends DomainError {
  constructor(email: string) {
    super(`A user with email ${email} already exists`);
    this.name = 'DuplicateUserError';
  }
}
