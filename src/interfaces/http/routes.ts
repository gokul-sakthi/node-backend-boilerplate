import type { FastifyInstance } from 'fastify';

import type { UserController } from './UserController.js';

export const registerRoutes = (app: FastifyInstance, userController: UserController): void => {
  app.post('/users/register', async (request, reply) => {
    await userController.register(request, reply);
  });
};
