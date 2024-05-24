import { z } from 'zod';
import { LocationValidator, NewLocationValidator, EditLocationValidator } from '../validators';

export type Location = z.infer<typeof LocationValidator>;
export type NewLocation = z.infer<typeof NewLocationValidator>;
export type EditLocation = z.infer<typeof EditLocationValidator>;
