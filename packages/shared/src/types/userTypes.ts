import { z } from 'zod';
import { UserValidator } from '../validators';

export type User = z.infer<typeof UserValidator>;
