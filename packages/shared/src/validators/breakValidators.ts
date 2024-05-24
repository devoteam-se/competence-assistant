import { z } from 'zod';

export const BreakIdValidator = z.string().uuid();

export const BreakValidator = z.object({
  id: BreakIdValidator,
  title: z.string().min(1),
  eventId: z.string().uuid(),
  start: z.string().min(1),
  end: z.string().min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const NewBreakValidator = BreakValidator.omit({ id: true, createdAt: true, updatedAt: true });

export const EditBreakValidator = BreakValidator.omit({ createdAt: true, updatedAt: true });
