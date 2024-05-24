import { z } from 'zod';

export const TrackValidator = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  obsolete: z.boolean(),
  color: z.string().length(7).regex(/^#/),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const SessionTrackValidator = TrackValidator.omit({ createdAt: true, updatedAt: true });

export const NewTrackValidator = TrackValidator.pick({ name: true, color: true });

export const EditTrackValidator = TrackValidator.pick({ name: true, color: true, id: true });
export const DeleteTrackValidator = TrackValidator.pick({ id: true });
