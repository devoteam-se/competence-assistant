import { Break } from './breakTypes';
import { Room } from './roomTypes';
import { ScheduleSession } from './scheduleSessionTypes';

export type Schedule = {
  sessions: ScheduleSession[];
  rooms: Room[];
  breaks: Break[];
};

export type ScheduleBreak = Omit<Break, 'eventId' | 'createdAt' | 'updatedAt'>;
