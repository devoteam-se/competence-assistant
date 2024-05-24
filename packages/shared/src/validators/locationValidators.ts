import { z } from 'zod';

export const LocationValidator = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  rooms: z.array(z.string()),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const NewLocationValidator = LocationValidator.pick({
  name: true,
  rooms: true,
});

export const EditLocationValidator = LocationValidator.pick({
  id: true,
  name: true,
  rooms: true,
});

export const DeleteLocationValidator = LocationValidator.pick({
  id: true,
});
