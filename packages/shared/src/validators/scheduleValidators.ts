import { z } from 'zod';
import { BreakValidator } from './breakValidators';
import { RoomValidator } from './roomValidators';
import { ScheduleSessionValidator } from './scheduleSessionValidators';

export const ScheduleValidator = z.object({
  sessions: z.array(ScheduleSessionValidator),
  rooms: z.array(RoomValidator),
  breaks: z.array(BreakValidator),
});
