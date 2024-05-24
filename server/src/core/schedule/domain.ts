import {
  Break,
  DeleteScheduleSession,
  EditBreak,
  EditScheduleSession,
  NewBreak,
  NewRoom,
  NewScheduleSession,
  Room,
  Schedule,
  ScheduleSession,
} from '@competence-assistant/shared';

export interface IScheduleRepo {
  getSchedule(id: string): Promise<Schedule>;
  createScheduleRoom(newScheduleRoom: NewRoom): Promise<Room>;
  createScheduleRooms(newScheduleRoom: NewRoom[]): Promise<Room[]>;
  deleteScheduleRoom(id: string): Promise<void>;
  deleteScheduleRooms(ids: string[]): Promise<void>;
  createScheduleSession(newScheduleSession: NewScheduleSession): Promise<ScheduleSession>;
  editScheduleSession(editScheduleSession: EditScheduleSession): Promise<ScheduleSession>;
  deleteScheduleSession(deleteScheduleSession: DeleteScheduleSession): Promise<void>;
  createScheduleBreak(newScheduleBreak: NewBreak): Promise<Break>;
  editScheduleBreak(editScheduleBreak: EditBreak): Promise<Break>;
  deleteScheduleBreak(id: string): Promise<void>;
}

export interface IScheduleService {
  getSchedule(id: string): Promise<Schedule>;
  createScheduleRoom(newScheduleRoom: NewRoom): Promise<Room>;
  createScheduleRooms(newScheduleRoom: NewRoom[]): Promise<Room[]>;
  deleteScheduleRoom(id: string): Promise<void>;
  deleteScheduleRooms(ids: string[]): Promise<void>;
  createScheduleSession(newScheduleSession: NewScheduleSession): Promise<ScheduleSession>;
  editScheduleSession(editScheduleSession: EditScheduleSession): Promise<ScheduleSession>;
  deleteScheduleSession(deleteScheduleSession: DeleteScheduleSession): Promise<void>;
  createScheduleBreak(newScheduleBreak: NewBreak): Promise<Break>;
  editScheduleBreak(editScheduleBreak: EditBreak): Promise<Break>;
  deleteScheduleBreak(id: string): Promise<void>;
}
