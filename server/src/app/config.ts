import { z } from 'zod';
import dotenv from 'dotenv';

const Config = z
  .object({
    development: z.boolean(),
    port: z.number(),
    postgres: z.object({
      user: z.string().min(1),
      password: z.string().min(1),
      host: z.string().min(1),
      database: z.string().min(1),
    }),
  })
  .strict();

export type Config = z.infer<typeof Config>;

export const createConfig = () => {
  dotenv.config();

  const config: Config = {
    development: process.env.NODE_ENV === 'development',
    port: parseInt(process.env.PORT || '8080', 10),
    postgres: {
      user: process.env.POSTGRES_USER || '',
      password: process.env.POSTGRES_PASSWORD || '',
      host: process.env.POSTGRES_HOST || '',
      database: process.env.POSTGRES_DATABASE || '',
    },
  };

  return Config.parse(config);
};
