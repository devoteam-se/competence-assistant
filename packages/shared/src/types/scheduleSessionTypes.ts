import { z } from 'zod';
import {
  DeleteScheduleSessionValidator,
  EditScheduleSessionValidator,
  NewScheduleSessionValidator,
  ScheduleSessionValidator,
} from '../validators';

export type ScheduleSession = z.infer<typeof ScheduleSessionValidator>;
export type NewScheduleSession = z.infer<typeof NewScheduleSessionValidator>;
export type EditScheduleSession = z.infer<typeof EditScheduleSessionValidator>;
export type DeleteScheduleSession = z.infer<typeof DeleteScheduleSessionValidator>;
