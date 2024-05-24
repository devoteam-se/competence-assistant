import { z } from 'zod';

export const ScheduleSessionValidator = z.object({
  id: z.string().uuid(),
  roomId: z.string().uuid(),
  sessionId: z.string().uuid(),
  eventId: z.string().uuid(),
  start: z.string().min(1),
  end: z.string().min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const NewScheduleSessionValidator = ScheduleSessionValidator.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const EditScheduleSessionValidator = NewScheduleSessionValidator;

export const DeleteScheduleSessionValidator = z.object({
  sessionId: z.string().uuid(),
  eventId: z.string().uuid(),
});
