import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DB_DRIVER: z.enum(['postgres', 'mongo', 'memory']).default('memory'),
  POSTGRES_URL: z.string().default('postgres://postgres:postgres@localhost:5432/app'),
  MONGO_URL: z.string().default('mongodb://localhost:27017'),
  MONGO_DB_NAME: z.string().default('app'),
  PAYMENT_PROVIDER: z.enum(['stripe', 'mock']).default('mock'),
  STORAGE_ROOT: z.string().default('./.data')
});

export type AppConfig = z.infer<typeof envSchema>;

export const loadConfig = (env: NodeJS.ProcessEnv = process.env): AppConfig => {
  return envSchema.parse(env);
};
