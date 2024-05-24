import {
  EventWithUniqueVoters,
  Event,
  NewEvent,
  EditEvent,
  EventFilter,
  Paging,
  PagedEvents,
  EventOrder,
} from '@competence-assistant/shared';
import crypto from 'crypto';
import { Sql } from 'postgres';

import { NotFound } from '../../../pkg/error';
import { IEventRepo } from '../domain';

class EventRepo implements IEventRepo {
  constructor(private sql: Sql) {}

  async getEvents({ states }: EventFilter, paging: Required<Paging>, order?: EventOrder): Promise<PagedEvents> {
    const active = states?.some((s) => ['active', 'votable'].includes(s));
    const where = [
      active ? this.sql`WHERE events.active = true` : this.sql`WHERE true`,
      states?.includes('votable') ? this.sql`AND events.voting_end_date > now()` : this.sql``,
      states?.includes('future') ? this.sql`AND events.end_date > now()` : this.sql``,
      states?.includes('past') ? this.sql`AND events.end_date < now()` : this.sql``,
      states?.includes('ongoing') ? this.sql`AND events.start_date < now() AND events.end_date > now()` : this.sql``,
    ];

    const select = this.sql`
      SELECT
        events.id,
        events.name,
        events.active,
        events.start_date AS "startDate",
        events.end_date AS "endDate",
        events.voting_end_date AS "votingEndDate",
        events.created_at AS "createdAt",
        events.updated_at AS "updatedAt",
        count(DISTINCT votes.user_id)::int AS "uniqueVoters",
        count(sessions)::int AS "sessionCount"
      `;

    const from = this.sql`
      FROM events
        LEFT JOIN sessions ON sessions.event_id = events.id
        LEFT JOIN votes ON votes.event_id = events.id
    `;

    const eventsQuery = this.sql<EventWithUniqueVoters[]>`
      ${select}
      ${from}
      ${where}
      GROUP BY events.id
      ${this.orderBy(order)}
      LIMIT ${paging.limit}
      OFFSET ${paging.offset}
    `;

    const countQuery = this.sql<{ total: number }[]>`
    SELECT
      COUNT(DISTINCT events.id) AS total
    FROM events
    ${where}
    `;

    const [events, count] = await Promise.all([eventsQuery, countQuery]);
    return { ...paging, total: count[0]?.total ?? 0, events };
  }

  private orderBy = (orderBy?: EventOrder) => {
    switch (orderBy) {
      case 'name':
        return this.sql`ORDER BY events.name ASC`;
      case 'oldest':
        return this.sql`ORDER BY events.created_at ASC`;
      case 'newest':
      default: {
        return this.sql`ORDER BY events.created_at DESC`;
      }
    }
  };

  async getEvent(id: string): Promise<Event> {
    const events = await this.sql<Event[]>`
    SELECT
      id,
      name,
      active,
      start_date as "startDate",
      end_date as "endDate",
      voting_end_date as "votingEndDate",
      created_at as "createdAt",
      updated_at as "updatedAt"
    FROM
      events
    WHERE id = ${id}
    `;
    if (!events[0]) {
      throw new NotFound('event not found');
    }

    return events[0];
  }

  async createEvent(newEvent: NewEvent): Promise<Event> {
    const events = await this.sql<Event[]>`
    INSERT INTO events (id, name, active, start_date, end_date, voting_end_date)
    VALUES(
      ${crypto.randomUUID()},
      ${newEvent.name},
      ${false},
      ${newEvent.startDate},
      ${newEvent.endDate},
      ${newEvent.votingEndDate})
    RETURNING
      id,
      name,
      active,
      start_date as "startDate",
      end_date as "endDate",
      voting_end_date as "votingEndDate",
      created_at as "createdAt",
      updated_at as "updatedAt"`;

    return events[0];
  }

  async editEvent(editEvent: EditEvent): Promise<Event> {
    const events = await this.sql<Event[]>`
      UPDATE events
      SET
        name = ${editEvent.name},
        start_date = ${editEvent.startDate},
        end_date = ${editEvent.endDate},
        voting_end_date = ${editEvent.votingEndDate},
        updated_at = ${new Date()}
      WHERE events.id = ${editEvent.id}
      RETURNING
        id,
        name,
        active,
        start_date as "startDate",
        end_date as "endDate",
        voting_end_date as "votingEndDate",
        created_at as "createdAt",
        updated_at as "updatedAt"
    `;
    return events[0];
  }

  async activateEvent(id: string): Promise<Event> {
    const events = await this.sql<Event[]>`
    UPDATE events
    SET
      active = TRUE
    WHERE events.id = ${id}
    RETURNING
      id,
      name,
      active,
      start_date as "startDate",
      end_date as "endDate",
      voting_end_date as "votingEndDate",
      created_at as "createdAt",
      updated_at as "updatedAt"
    `;
    if (!events[0]) {
      throw new NotFound('event not found');
    }

    return events[0];
  }

  async deactivateEvent(id: string): Promise<Event> {
    const events = await this.sql<Event[]>`
    UPDATE events
    SET
      active = FALSE
    WHERE events.id = ${id}
    RETURNING
      id,
      name,
      active,
      start_date as "startDate",
      end_date as "endDate",
      voting_end_date as "votingEndDate",
      created_at as "createdAt",
      updated_at as "updatedAt"
    `;
    if (!events[0]) {
      throw new NotFound('event not found');
    }

    return events[0];
  }

  async deleteEvent(id: string): Promise<void> {
    await this.sql`
    DELETE FROM events
    WHERE id = ${id}
    `;
  }
}

export default EventRepo;
