import { z } from 'zod';

export const UserValidator = z.object({
  id: z.string(),
  name: z.string().min(1),
  photoUrl: z.string(),
  admin: z.boolean(),
  email: z.string().email(),
});
