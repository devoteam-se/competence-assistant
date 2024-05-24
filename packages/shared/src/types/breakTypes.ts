import { z } from 'zod';
import { BreakValidator, EditBreakValidator, NewBreakValidator } from '../validators';

export type Break = z.infer<typeof BreakValidator>;
export type NewBreak = z.infer<typeof NewBreakValidator>;
export type EditBreak = z.infer<typeof EditBreakValidator>;
export type DeleteBreak = Pick<Break, 'eventId' | 'id'>;
