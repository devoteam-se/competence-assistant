import {
  NewScheduleSession,
  ScheduleSession,
  DeleteScheduleSession,
  Schedule,
  EditScheduleSession,
  NewRoom,
  Room,
  Break,
  EditBreak,
  NewBreak,
} from '@competence-assistant/shared';
import { IScheduleService, IScheduleRepo } from '../domain';

export default class ScheduleService implements IScheduleService {
  constructor(private scheduleRepo: IScheduleRepo) {}

  async createScheduleRoom(newScheduleRoom: NewRoom): Promise<Room> {
    return this.scheduleRepo.createScheduleRoom(newScheduleRoom);
  }

  async createScheduleRooms(newScheduleRoom: NewRoom[]): Promise<Room[]> {
    return this.scheduleRepo.createScheduleRooms(newScheduleRoom);
  }

  async deleteScheduleRoom(id: string): Promise<void> {
    return this.scheduleRepo.deleteScheduleRoom(id);
  }

  async deleteScheduleRooms(ids: string[]): Promise<void> {
    return this.scheduleRepo.deleteScheduleRooms(ids);
  }

  async createScheduleSession(newScheduleSession: NewScheduleSession): Promise<ScheduleSession> {
    return this.scheduleRepo.createScheduleSession(newScheduleSession);
  }

  async deleteScheduleSession(deleteScheduleSession: DeleteScheduleSession): Promise<void> {
    return this.scheduleRepo.deleteScheduleSession(deleteScheduleSession);
  }

  async getSchedule(id: string): Promise<Schedule> {
    return this.scheduleRepo.getSchedule(id);
  }

  async editScheduleSession(editScheduleSession: EditScheduleSession): Promise<ScheduleSession> {
    return this.scheduleRepo.editScheduleSession(editScheduleSession);
  }

  async createScheduleBreak(newScheduleBreak: NewBreak): Promise<Break> {
    return this.scheduleRepo.createScheduleBreak(newScheduleBreak);
  }

  async editScheduleBreak(editScheduleBreak: EditBreak): Promise<Break> {
    return this.scheduleRepo.editScheduleBreak(editScheduleBreak);
  }

  async deleteScheduleBreak(id: string): Promise<void> {
    return this.scheduleRepo.deleteScheduleBreak(id);
  }
}
