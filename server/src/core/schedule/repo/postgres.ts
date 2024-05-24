import {
  Schedule,
  NewRoom,
  Room,
  NewScheduleSession,
  ScheduleSession,
  EditScheduleSession,
  DeleteScheduleSession,
  NewBreak,
  Break,
  EditBreak,
} from '@competence-assistant/shared';
import { randomUUID } from 'crypto';
import { Sql } from 'postgres';
import { IScheduleRepo } from '../domain';

class ScheduleRepo implements IScheduleRepo {
  constructor(private sql: Sql) {}

  async getSchedule(id: string): Promise<Schedule> {
    const schedules = await this.sql<Schedule[]>`
    SELECT 
      COALESCE(json_agg(DISTINCT jsonb_build_object(
        'id', schedule_sessions.id,
        'eventId',schedule_sessions.event_id, 
        'roomId',schedule_sessions.room_id, 
        'sessionId', schedule_sessions.session_id,
        'start', schedule_sessions.start,
        'end', schedule_sessions.end,
        'createdAt',schedule_sessions.created_at,
        'updatedAt',schedule_sessions.updated_at)) FILTER (WHERE schedule_sessions.id IS NOT NULL), '[]')
      AS sessions,
      COALESCE(json_agg(DISTINCT jsonb_build_object(
        'id', schedule_rooms.id,
        'eventId',schedule_rooms.event_id, 
        'name',schedule_rooms.name,
        'createdAt',schedule_rooms.created_at,
        'updatedAt',schedule_rooms.updated_at)) FILTER (WHERE schedule_rooms.id IS NOT NULL), '[]')
      AS rooms,
      COALESCE(json_agg(DISTINCT jsonb_build_object(
        'id', schedule_breaks.id,
        'eventId',schedule_breaks.event_id, 
        'title',schedule_breaks.title,
        'start', schedule_breaks.start,
        'end', schedule_breaks.end,
        'createdAt',schedule_breaks.created_at,
        'updatedAt',schedule_breaks.updated_at)) FILTER (WHERE schedule_breaks.id IS NOT NULL), '[]')
      AS breaks
    FROM events 
    LEFT JOIN schedule_sessions ON schedule_sessions.event_id = events.id
    LEFT JOIN schedule_rooms ON schedule_rooms.event_id = events.id
    LEFT JOIN schedule_breaks ON schedule_breaks.event_id = events.id
    WHERE events.id = ${id}
    GROUP BY
      events.id
    `;

    return schedules[0];
  }

  async createScheduleRoom(newScheduleRoom: NewRoom): Promise<Room> {
    const scheduleRooms = await this.sql<Room[]>`
    INSERT INTO schedule_rooms(id, name, event_id)
    VALUES(${randomUUID()}, ${newScheduleRoom.name}, ${newScheduleRoom.eventId})
    RETURNING
      id,
      name,
      event_id AS "eventId",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    `;

    return scheduleRooms[0];
  }

  async createScheduleRooms(newScheduleRooms: NewRoom[]): Promise<Room[]> {
    const insertData = newScheduleRooms.map(({ name, eventId }) => {
      return { id: randomUUID(), name, event_id: eventId };
    });

    const tracks = await this.sql<Room[]>`
    INSERT INTO schedule_rooms ${this.sql(insertData)}
    RETURNING 
      id,
      name,
      event_id AS "eventId",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    `;

    return tracks;
  }

  async deleteScheduleRoom(id: string): Promise<void> {
    await this.sql`
    DELETE FROM schedule_rooms
    WHERE id = ${id}
    `;
  }

  async deleteScheduleRooms(ids: string[]): Promise<void> {
    await this.sql`
    DELETE FROM schedule_rooms
    WHERE id IN ${this.sql(ids)}
    `;
  }

  async createScheduleSession(newScheduleSession: NewScheduleSession): Promise<ScheduleSession> {
    const scheduleSessions = await this.sql<ScheduleSession[]>`
    INSERT INTO schedule_sessions(id, session_id, event_id, room_id, start, "end")
    VALUES(
      ${randomUUID()}, 
      ${newScheduleSession.sessionId}, 
      ${newScheduleSession.eventId},
      ${newScheduleSession.roomId},
      ${newScheduleSession.start},
      ${newScheduleSession.end}
      )
    RETURNING
      id,
      session_id AS "sessionId",
      event_id AS "eventId",
      room_id AS "roomId",
      start,
      "end",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
      `;

    return scheduleSessions[0];
  }

  async editScheduleSession(editScheduleSession: EditScheduleSession): Promise<ScheduleSession> {
    const scheduleSession = await this.sql<ScheduleSession[]>`
    UPDATE schedule_sessions
    SET
      room_id = ${editScheduleSession.roomId},
      start = ${editScheduleSession.start},
      "end" = ${editScheduleSession.end},
      updated_at = ${new Date()}
    WHERE session_id = ${editScheduleSession.sessionId}
    AND event_id = ${editScheduleSession.eventId}
    RETURNING
      id, 
      event_id AS "eventId", 
      session_id AS "sessionId", 
      room_id AS "roomId",
      start,
      "end",
      created_at as "createdAt",
      updated_at as "updatedAt"
    `;

    return scheduleSession[0];
  }

  async deleteScheduleSession(deleteScheduleSession: DeleteScheduleSession): Promise<void> {
    await this.sql`
    DELETE FROM schedule_sessions
    WHERE session_id = ${deleteScheduleSession.sessionId}
    AND event_id = ${deleteScheduleSession.eventId}
    `;
  }

  async createScheduleBreak(newScheduleBreak: NewBreak): Promise<Break> {
    const scheduleBreaks = await this.sql<Break[]>`
    INSERT INTO schedule_breaks(id, title, event_id, start, "end")
    VALUES(
      ${randomUUID()}, 
      ${newScheduleBreak.title}, 
      ${newScheduleBreak.eventId},
      ${newScheduleBreak.start},
      ${newScheduleBreak.end}
      )
    RETURNING
      id,
      title,
      event_id AS "eventId",
      start,
      "end",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
      `;

    return scheduleBreaks[0];
  }

  async editScheduleBreak(editScheduleBreak: EditBreak): Promise<Break> {
    const scheduleBreak = await this.sql<Break[]>`
    UPDATE schedule_breaks
    SET
      title = ${editScheduleBreak.title},
      event_id = ${editScheduleBreak.eventId},
      start = ${editScheduleBreak.start},
      "end" = ${editScheduleBreak.end},
      updated_at = ${new Date()}
    WHERE id = ${editScheduleBreak.id}
    RETURNING
      id,
      title,
      event_id AS "eventId", 
      start,
      "end",
      created_at as "createdAt",
      updated_at as "updatedAt"
    `;

    return scheduleBreak[0];
  }

  async deleteScheduleBreak(id: string): Promise<void> {
    await this.sql`
    DELETE FROM schedule_breaks
    WHERE id = ${id}
    `;
  }
}

export default ScheduleRepo;
