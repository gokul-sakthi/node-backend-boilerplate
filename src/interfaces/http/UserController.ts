import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { DomainError } from '../../core/errors/DomainError.js';
import type { RegisterUserUseCase } from '../../core/usecases/RegisterUserUseCase.js';

const registerSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(2),
  initialCreditCents: z.number().int().min(0)
});

export class UserController {
  constructor(private readonly registerUserUseCase: RegisterUserUseCase) {}

  async register(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const payload = registerSchema.parse(request.body);

    try {
      const user = await this.registerUserUseCase.execute(payload);
      reply.code(201).send({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        createdAt: user.createdAt.toISOString()
      });
    } catch (error) {
      if (error instanceof DomainError) {
        reply.code(409).send({ message: error.message });
        return;
      }

      throw error;
    }
  }
}
