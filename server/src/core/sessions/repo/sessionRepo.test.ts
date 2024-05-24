import type { Sql } from 'postgres';
import SessionRepo from './postgres';
import { SessionOrder, SessionTypeEnum } from '@competence-assistant/shared';

function parseQueryLines(args: unknown) {
  if (!Array.isArray(args)) return [];
  return args
    .map((arg) => (typeof arg === 'string' ? arg.trim().replaceAll('\n', ' ').replace(/\s+/g, ' ') : ''))
    .filter((str) => str);
}

describe('sessionRepo', () => {
  describe('getSessions', () => {
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

    it('should select sessions and total', async () => {
      // given
      const sessionRepo = new SessionRepo(sql);
      const filter = {};
      const paging = { limit: 20, offset: 0 };

      // when
      await sessionRepo.getSessions(filter, paging);

      // then
      expect(sql).toHaveBeenCalled();

      // it should select sessions and total
      expect(queryLines.filter((line) => line.startsWith('SELECT'))).toEqual([
        'SELECT sessions.id, sessions.name, sessions.description, sessions.type, sessions.level, sessions.duration, sessions.max_participants AS "maxParticipants", sessions.recording_url AS "recordingUrl", sessions.slides_url AS "slidesUrl", sessions.meeting_url AS "meetingUrl", sessions.feedback_url AS "feedbackUrl", sessions.event_id AS "eventId", sessions.created_at AS "createdAt", sessions.updated_at AS "updatedAt", sessions.created_from_session_id AS "createdFromSessionId",',
        'SELECT COUNT(DISTINCT sessions.id) as total',
      ]);

      // it should only contain sessions with an event
      expect(queryLines.filter((line) => line.startsWith('WHERE'))).toEqual(['WHERE sessions.event_id IS NOT NULL']);

      // it should not contain any orther filters
      expect(queryLines.filter((line) => line.startsWith('AND'))).toEqual([]);

      // it should limit the result
      expect(queryLines.filter((line) => line.startsWith('LIMIT'))).toHaveLength(1);

      // it should offset the result
      expect(queryLines.filter((line) => line.startsWith('OFFSET'))).toHaveLength(1);

      // it should order by session name (default)
      expect(queryLines.filter((line) => line.startsWith('ORDER BY'))).toEqual(['ORDER BY sessions.name ASC']);

      // it should select and join tracks
      expect(queryLines).toContain(
        'LEFT JOIN sessions_tracks ON sessions_tracks.session_id = sessions.id LEFT JOIN tracks ON tracks.id = sessions_tracks.track_id',
      );
      expect(queryLines).toContain(
        "COALESCE (json_agg(DISTINCT jsonb_build_object( 'id', tracks.id, 'obsolete', tracks.obsolete, 'name', tracks.name, 'color', tracks.color)) FILTER (WHERE tracks.id IS NOT NULL), '[]') AS tracks,",
      );

      // it should select and join hosts
      expect(queryLines).toContain(
        'LEFT JOIN hosts ON hosts.session_id = sessions.id LEFT JOIN users AS users_hosts ON users_hosts.id = hosts.user_id',
      );
      expect(queryLines).toContain(
        "COALESCE (json_agg(DISTINCT jsonb_build_object( 'id', users_hosts.id, 'email', users_hosts.email, 'name', users_hosts.name, 'photoUrl', users_hosts.photo_url)) FILTER (WHERE users_hosts.id IS NOT NULL), '[]') AS hosts,",
      );

      // it should select and join voters
      expect(queryLines).toContain(
        'LEFT JOIN votes ON votes.session_id = sessions.id AND votes.event_id = sessions.event_id LEFT JOIN users AS users_votes ON users_votes.id = votes.user_id',
      );
      expect(queryLines).toContain(
        "COALESCE (json_agg(DISTINCT jsonb_build_object( 'id', users_votes.id, 'email', users_votes.email, 'name', users_votes.name, 'photoUrl', users_votes.photo_url)) FILTER (WHERE users_votes.id IS NOT NULL), '[]') AS voters,",
      );
    });

    it('should filter by event ids', async () => {
      // given
      const sessionRepo = new SessionRepo(sql);
      const filter = { events: ['eventId1', 'eventId2'] };
      const paging = { limit: 20, offset: 0 };

      // when
      await sessionRepo.getSessions(filter, paging);

      // then
      expect(queryLines).toContain('AND sessions.event_id IN');
      filter.events.forEach((eventId) => expect(queryLines).toContain(eventId));
    });

    it('should filter by track ids', async () => {
      // given
      const sessionRepo = new SessionRepo(sql);
      const filter = { tracks: ['trackId1', 'trackId2'] };
      const paging = { limit: 20, offset: 0 };

      // when
      await sessionRepo.getSessions(filter, paging);

      // then
      expect(queryLines).toContain('AND sessions_tracks.track_id IN');
      filter.tracks.forEach((trackId) => expect(queryLines).toContain(trackId));
    });

    it('should should filter by session types', async () => {
      // given
      const sessionRepo = new SessionRepo(sql);
      const filter = { types: [SessionTypeEnum.Session, SessionTypeEnum.Roundtable] };
      const paging = { limit: 20, offset: 0 };

      // when
      await sessionRepo.getSessions(filter, paging);

      // then
      expect(queryLines).toContain('AND sessions.type IN');
      filter.types.forEach((type) => expect(queryLines).toContain(type));
    });

    it('should filter users favourite sessions', async () => {
      // given
      const sessionRepo = new SessionRepo(sql);
      const filter = { favouritedBy: 'userId' };
      const paging = { limit: 20, offset: 0 };

      // when
      await sessionRepo.getSessions(filter, paging, undefined, { userId: 'userId' });

      // then
      // it should filter by user id
      expect(queryLines).toContain('INNER JOIN favourite_sessions ON favourite_sessions.session_id = sessions.id');

      // it should join user_favourite_sessions
      expect(queryLines).toContain(
        'LEFT JOIN user_favourite_sessions ON user_favourite_sessions.session_id = sessions.id',
      );
      // it should be included in the select
      expect(queryLines).toContain(
        'EXISTS( SELECT 1 FROM user_favourite_sessions WHERE user_favourite_sessions.user_id =',
      );
    });

    it('should filter by users votes', async () => {
      // given
      const sessionRepo = new SessionRepo(sql);
      const filter = { votedBy: 'userId' };
      const paging = { limit: 20, offset: 0 };

      // when
      await sessionRepo.getSessions(filter, paging);

      // then
      expect(queryLines).toContain('INNER JOIN voted_sessions ON voted_sessions.session_id = sessions.id');
    });

    it('should filter by users hosts', async () => {
      // given
      const sessionRepo = new SessionRepo(sql);
      const filter = { hostedBy: 'userId' };

      // when
      await sessionRepo.getSessions(filter, { limit: 20, offset: 0 });

      // then
      expect(queryLines).toContain('INNER JOIN hosted_sessions ON hosted_sessions.session_id = sessions.id');
    });

    it('should include drafts', async () => {
      // given
      const sessionRepo = new SessionRepo(sql);
      const filter = {};

      // when
      await sessionRepo.getSessions(filter, { limit: 20, offset: 0 }, undefined, { includeDrafts: true });

      // then
      expect(queryLines).not.toContain('WHERE sessions.event_id IS NOT NULL');
      expect(queryLines).toContain('WHERE true');
    });

    it('should order by votes', async () => {
      // given
      const sessionRepo = new SessionRepo(sql);
      const filter = {};
      const orderBy = SessionOrder.Votes;

      // when
      await sessionRepo.getSessions(filter, { limit: 20, offset: 0 }, orderBy);

      // then
      expect(queryLines).toContain('ORDER BY COUNT(DISTINCT votes.user_id) DESC');
    });

    it('should order by newest', async () => {
      // given
      const sessionRepo = new SessionRepo(sql);
      const filter = {};
      const orderBy = SessionOrder.Newest;

      // when
      await sessionRepo.getSessions(filter, { limit: 20, offset: 0 }, orderBy);

      // then
      expect(queryLines).toContain('ORDER BY sessions.created_at DESC');
    });

    it('should order by oldest', async () => {
      // given
      const sessionRepo = new SessionRepo(sql);
      const filter = {};
      const orderBy = SessionOrder.Oldest;

      // when
      await sessionRepo.getSessions(filter, { limit: 20, offset: 0 }, orderBy);

      // then
      expect(queryLines).toContain('ORDER BY sessions.created_at ASC');
    });
  });
});
