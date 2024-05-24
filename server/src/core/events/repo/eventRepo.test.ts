import type { Sql } from 'postgres';
import EventRepo from './postgres';
import { EventFilter, EventOrder } from '@competence-assistant/shared';

function parseQueryLines(args: unknown) {
  if (!Array.isArray(args)) return [];
  return args
    .map((arg) => (typeof arg === 'string' ? arg.trim().replaceAll('\n', ' ').replace(/\s+/g, ' ') : ''))
    .filter((str) => str);
}

describe('eventRepo', () => {
  describe('getEvents', () => {
    let queryLines: string[] = [];
    // !Note: This is a quick and filthy way to mock the postgres.sql function
    // the downside is that it args won't contain any interpolated values,
    // but it's good enough for our purposes
    const sql = jest.fn().mockImplementation((args) => {
      queryLines.push(...parseQueryLines(args));
      return [];
    }) as unknown as Sql;

    beforeEach(() => {
      queryLines = [];
    });

    it('should select events and total', async () => {
      // given
      const repo = new EventRepo(sql);
      const filter = {};
      const paging = { limit: 20, offset: 0 };

      // when
      await repo.getEvents(filter, paging);

      // then
      expect(sql).toHaveBeenCalled();

      // it should select events and total
      expect(queryLines.filter((line) => line.startsWith('SELECT'))).toEqual([
        'SELECT events.id, events.name, events.active, events.start_date AS "startDate", events.end_date AS "endDate", events.voting_end_date AS "votingEndDate", events.created_at AS "createdAt", events.updated_at AS "updatedAt", count(DISTINCT votes.user_id)::int AS "uniqueVoters", count(sessions)::int AS "sessionCount"',
        'SELECT COUNT(DISTINCT events.id) AS total FROM events',
      ]);

      // it should join sessions and votes
      expect(queryLines.filter((line) => line.startsWith('FROM'))).toEqual([
        'FROM events LEFT JOIN sessions ON sessions.event_id = events.id LEFT JOIN votes ON votes.event_id = events.id',
      ]);

      // it should not apply any filters
      expect(queryLines.filter((line) => line.startsWith('WHERE'))).toEqual(['WHERE true']);

      // it should not contain any orther filters
      expect(queryLines.filter((line) => line.startsWith('AND'))).toEqual([]);

      // it should limit the result
      expect(queryLines.filter((line) => line.startsWith('LIMIT'))).toHaveLength(1);

      // it should offset the result
      expect(queryLines.filter((line) => line.startsWith('OFFSET'))).toHaveLength(1);

      // it should order by created_at desc (default)
      expect(queryLines.filter((line) => line.startsWith('ORDER BY'))).toEqual(['ORDER BY events.created_at DESC']);
    });

    it('should order by name', async () => {
      // given
      const repo = new EventRepo(sql);
      const filter = {};
      const paging = { limit: 20, offset: 0 };
      const orderBy = EventOrder.Name;

      // when
      await repo.getEvents(filter, paging, orderBy);

      // then
      expect(queryLines.filter((line) => line.startsWith('ORDER BY'))).toEqual(['ORDER BY events.name ASC']);
    });

    it('should order by oldest', async () => {
      // given
      const repo = new EventRepo(sql);
      const filter = {};
      const paging = { limit: 20, offset: 0 };
      const orderBy = EventOrder.Oldest;

      // when
      await repo.getEvents(filter, paging, orderBy);

      // then
      expect(queryLines.filter((line) => line.startsWith('ORDER BY'))).toEqual(['ORDER BY events.created_at ASC']);
    });

    it('should filter by ongoing events', async () => {
      // given
      const repo = new EventRepo(sql);
      const filter = { states: ['ongoing' as const] };
      const paging = { limit: 20, offset: 0 };

      // when
      await repo.getEvents(filter, paging);

      // then
      expect(queryLines).toContain('AND events.start_date < now() AND events.end_date > now()');
    });

    it('should filter by past events', async () => {
      // given
      const repo = new EventRepo(sql);
      const filter = { states: ['past' as const] };
      const paging = { limit: 20, offset: 0 };

      // when
      await repo.getEvents(filter, paging);

      // then
      expect(queryLines).toContain('AND events.end_date < now()');
    });

    it('should filter by future events', async () => {
      // given
      const repo = new EventRepo(sql);
      const filter = { states: ['future' as const] };
      const paging = { limit: 20, offset: 0 };

      // when
      await repo.getEvents(filter, paging);

      // then
      expect(queryLines).toContain('AND events.end_date > now()');
    });

    it('should filter by votable events', async () => {
      // given
      const repo = new EventRepo(sql);
      const filter = { states: ['votable' as const] };
      const paging = { limit: 20, offset: 0 };

      // when
      await repo.getEvents(filter, paging);

      // then
      expect(queryLines).toContain('WHERE events.active = true');
      expect(queryLines).toContain('AND events.voting_end_date > now()');
    });

    it('should filter by active events', async () => {
      // given
      const repo = new EventRepo(sql);
      const filter = { states: ['active' as const] };
      const paging = { limit: 20, offset: 0 };

      // when
      await repo.getEvents(filter, paging);

      // then
      expect(queryLines).toContain('WHERE events.active = true');
    });

    it('should filter by multiple states', async () => {
      // given
      const repo = new EventRepo(sql);
      const filter: EventFilter = { states: ['future', 'past'] };
      const paging = { limit: 20, offset: 0 };

      // when
      await repo.getEvents(filter, paging);

      // then
      expect(queryLines).toContain('WHERE true');
      expect(queryLines).toContain('AND events.end_date > now()');
      expect(queryLines).toContain('AND events.end_date < now()');
    });
  });
});
