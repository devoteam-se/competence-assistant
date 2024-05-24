import {
  Room,
  ScheduleBreak,
  NewBreak,
  EditBreak,
  Schedule,
  ScheduleSession,
  NewScheduleSession,
  EditScheduleSession,
  DeleteScheduleSession,
  DeleteBreak,
  NewRoom,
} from '@competence-assistant/shared';
import { get, post, put, _delete } from './method';

export default {
  getSchedule: async (eventId: string) => {
    const res = await get<Schedule>(`events/${eventId}/schedule`);
    return res;
  },
  createScheduleSession: async (scheduleSession: NewScheduleSession) => {
    const res = await post<ScheduleSession, NewScheduleSession>(
      `events/${scheduleSession.eventId}/schedule/sessions`,
      scheduleSession,
    );
    return res;
  },
  editScheduleSession: async (scheduleSession: EditScheduleSession) => {
    const res = await put<ScheduleSession, EditScheduleSession>(
      `events/${scheduleSession.eventId}/schedule/sessions/${scheduleSession.sessionId}`,
      scheduleSession,
    );
    return res;
  },
  deleteScheduleSession: async ({ eventId, sessionId }: DeleteScheduleSession) => {
    await _delete(`events/${eventId}/schedule/sessions/${sessionId}`);
  },
  createScheduleBreak: async (scheduleBreak: NewBreak) => {
    const res = await post<ScheduleBreak, NewBreak>(`events/${scheduleBreak.eventId}/schedule/breaks`, scheduleBreak);
    return res;
  },
  editScheduleBreak: async (scheduleBreak: EditBreak) => {
    const res = await put<ScheduleBreak, EditBreak>(
      `events/${scheduleBreak.eventId}/schedule/breaks/${scheduleBreak.id}`,
      scheduleBreak,
    );
    return res;
  },
  deleteScheduleBreak: async ({ eventId, id }: DeleteBreak) => {
    await _delete(`events/${eventId}/schedule/breaks/${id}`);
  },
  createRoom: async ({ name, eventId }: NewRoom) => {
    const res = await post<Room, { name: string }>(`events/${eventId}/schedule/rooms`, { name });
    return res;
  },
  setRoomTemplate: async ({ roomNames, eventId }: { roomNames: { name: string }[]; eventId: string }) => {
    const res = await post<Room[], { name: string }[]>(`events/${eventId}/schedule/rooms`, roomNames);
    return res;
  },
  resetRoomTemplate: async ({ roomIds, eventId }: { roomIds: string[]; eventId: string }) => {
    await _delete(`events/${eventId}/schedule/rooms`, roomIds);
  },
  deleteRoom: async ({ roomId, eventId }: { roomId: string; eventId: string }) => {
    await _delete(`events/${eventId}/schedule/rooms/${roomId}`);
  },
};
