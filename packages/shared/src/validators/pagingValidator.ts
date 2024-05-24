import { z } from 'zod';

export const PagingValidator = z.object({
  limit: z.number().int().positive().optional(),
  offset: z.number().int().nonnegative().default(0),
});
