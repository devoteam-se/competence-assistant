import { z } from 'zod';
import { EventOrder } from '../enums';

export const EventIdValidator = z.string().uuid();

export const EventValidator = z.object({
  id: EventIdValidator,
  name: z.string().min(1),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  votingEndDate: z.nullable(z.string().datetime()),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  active: z.boolean(),
});

export const NewEventValidator = EventValidator.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  active: true,
}).refine(({ endDate, votingEndDate }) => votingEndDate === null || endDate >= votingEndDate, {
  message: 'Voting end date must be before event date',
  path: ['votingEndDate'],
});

export const EditEventValidator = EventValidator.omit({ createdAt: true, updatedAt: true }).refine(
  (data) => data.votingEndDate === null || data.endDate >= data.votingEndDate,
  {
    message: 'Voting end date must be before event date',
    path: ['votingEndDate'],
  },
);

export const EventWithUniqueVotersValidator = EventValidator.extend({
  uniqueVoters: z.number().nullable(),
  sessionCount: z.number().nullable(),
});

export const EventOrderValidator = z.nativeEnum(EventOrder).optional();
export const EventStateValidator = z.enum(['active', 'future', 'ongoing', 'past', 'votable']);
export const EventFilterValidator = z.object({ states: EventStateValidator.array().optional() });
