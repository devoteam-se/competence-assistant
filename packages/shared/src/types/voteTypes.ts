import { z } from 'zod';
import { VoteValidator } from '../validators';

export type Vote = z.infer<typeof VoteValidator>;
