import type {
  EditLinks,
  EditSession,
  NewSession,
  SessionTrack,
  User,
  Vote,
  Session,
  PagedSessions,
  SessionFilter,
  SessionOrder,
  Paging,
} from '@competence-assistant/shared';
import { randomUUID } from 'crypto';
import type { Sql } from 'postgres';
import { NotFound } from '../../../pkg/error';
import { GetSessionsOptions, ISessionRepo } from '../domain';

type FetchOptions = {
  includeTracks?: boolean;
  includeHosts?: boolean;
  includeVotes?: boolean;
  // takes a user id. If provided, will include a boolean field "favourite" on each session,
  // indicating whether the user has favourited it.
  includeFavouritesForUser?: string | null;
};

class SessionRepo implements ISessionRepo {
  constructor(private sql: Sql) {}

  async createSession(newSession: NewSession): Promise<Session> {
    const sessions = await this.sql<Session[]>`
    INSERT INTO sessions (id, name, description, type, level, duration, max_participants, recording_url, slides_url, meeting_url, event_id, feedback_url, created_from_session_id)
		VALUES(
      ${randomUUID()},
      ${newSession.name},
      ${newSession.description},
      ${newSession.type},
      ${newSession.level},
      ${newSession.duration},
      ${newSession.maxParticipants},
      ${newSession.recordingUrl},
      ${newSession.slidesUrl},
      ${newSession.meetingUrl},
      ${newSession.eventId},
      ${newSession.feedbackUrl},
      ${newSession.createdFromSessionId})
    RETURNING
      id,
      name,
      description,
      type,
      level,
      duration,
      max_participants AS "maxParticipants",
      recording_url AS "recordingUrl",
      slides_url AS "slidesUrl",
      meeting_url AS "meetingUrl",
      feedback_url AS "feedbackUrl",
      event_id as "eventId",
      created_at AS "createdAt",
      updated_at AS "updatedAt",
      created_from_session_id AS "createdFromSessionId"
    `;

    return sessions[0];
  }

  async addHosts(userIds: string[], sessionId: string): Promise<User[]> {
    if (userIds.length === 0) return [];

    const insertData = userIds.map((userId) => {
      return { user_id: userId, session_id: sessionId };
    });

    const users = await this.sql<User[]>`
      WITH inserted_host AS (
        INSERT INTO hosts ${this.sql(insertData)}
          RETURNING user_id
      )
      SELECT id, email, name, photo_url AS "photoUrl"
      FROM inserted_host
             LEFT JOIN users ON id = user_id
    `;

    return users;
  }

  async addTracks(trackIds: string[], sessionId: string): Promise<SessionTrack[]> {
    if (trackIds.length === 0) return [];

    const insertData = trackIds.map((trackId) => {
      return { track_id: trackId, session_id: sessionId };
    });

    const tracks = await this.sql<SessionTrack[]>`
      WITH inserted_tracks AS (
        INSERT INTO sessions_tracks ${this.sql(insertData)}
          RETURNING track_id
      )
      SELECT id, name, color
      FROM inserted_tracks
             LEFT JOIN tracks ON inserted_tracks.track_id = tracks.id
    `;

    return tracks;
  }

  async createVote({ sessionId, eventId, userId }: Vote): Promise<Vote> {
    const vote = await this.sql<Vote[]>`
      INSERT INTO votes (session_id, user_id, event_id)
      VALUES (${sessionId}, ${userId}, ${eventId})
      RETURNING session_id as "sessionId", user_id as "userId", event_id as "eventId"`;

    return vote[0];
  }

  async eventHasEnded(sessionId: string): Promise<boolean> {
    const rows = await this.sql`
    SELECT 1
    FROM sessions
    LEFT JOIN events ON events.id = sessions.event_id
    WHERE sessions.id = ${sessionId}
    AND (end_date < now() AND end_date IS NOT NULL)
    LIMIT 1
    `;

    return !!rows[0];
  }

  async updateSessionEvent(sessionId: string, eventId: string): Promise<Session | undefined> {
    const session = await this.sql<Session[]>`
    UPDATE sessions
    SET event_id = ${eventId}
    WHERE id = ${sessionId}
    RETURNING
      id,
      name,
      description,
      duration,
      recording_url AS "recordingUrl",
      slides_url AS "slidesUrl",
      meeting_url AS "meetingUrl",
      feedback_url AS "feedbackUrl",
      event_id AS "eventId",
      type,
      level,
      max_participants AS "maxParticipants",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    `;
    return session[0];
  }

  async editSession(session: EditSession): Promise<Session> {
    const sessions = await this.sql<Session[]>`
      UPDATE sessions
      SET name             = ${session.name},
          description      = ${session.description},
          type             = ${session.type},
          level            = ${session.level},
          duration         = ${session.duration},
          max_participants = ${session.maxParticipants},
          event_id         = ${session.eventId},
          recording_url    = ${session.recordingUrl},
          slides_url       = ${session.slidesUrl},
          meeting_url      = ${session.meetingUrl},
          feedback_url     = ${session.feedbackUrl},
          updated_at       = ${new Date()}
      WHERE sessions.id = ${session.id}
      RETURNING id, name, description, duration, recording_url AS "recordingUrl", slides_url AS "slidesUrl", meeting_url AS "meetingUrl", feedback_url AS "feedbackUrl", event_id AS "eventId", type, level, max_participants AS "maxParticipants", created_at AS "createdAt", updated_at AS "updatedAt"
    `;

    return sessions[0];
  }

  async deleteHosts(sessionId: string): Promise<void> {
    await this.sql`
    DELETE FROM hosts
    WHERE session_id = ${sessionId}
    `;
  }

  async deleteTracks(sessionId: string): Promise<void> {
    await this.sql`
    DELETE FROM sessions_tracks
    WHERE session_id = ${sessionId}
    `;
  }

  async deleteVote(vote: Partial<Vote>): Promise<void> {
    if (Object.values(vote).every((v) => !v)) return;
    const where = [
      this.sql`WHERE true`,
      vote.sessionId ? this.sql`AND session_id = ${vote.sessionId}` : this.sql``,
      vote.userId ? this.sql`AND user_id = ${vote.userId}` : this.sql``,
      vote.eventId ? this.sql`AND event_id = ${vote.eventId}` : this.sql``,
    ];

    await this.sql`
      DELETE FROM votes
      ${where}
    `;
  }

  async getHostsForSession(sessionId: string): Promise<User[]> {
    return this.sql<User[]>`
      SELECT *
      FROM users
      JOIN hosts ON users.id = hosts.user_id
      WHERE hosts.session_id = ${sessionId}
    `;
  }

  async getTracksForSession(sessionId: string): Promise<SessionTrack[]> {
    return this.sql<SessionTrack[]>`
      SELECT *
      FROM tracks
      JOIN sessions_tracks ON tracks.id = sessions_tracks.track_id
      WHERE sessions_tracks.session_id = ${sessionId}
    `;
  }

  async getSession(sessionId: string, userId: string | null): Promise<Session | undefined> {
    const options = { includeFavouritesForUser: userId };
    const result = await this.sql<Session[]>`
      ${this.select(options)}
      ${this.from(options)}
      WHERE sessions.id = ${sessionId}
      GROUP BY sessions.id
      LIMIT 1
    `;

    return result.length ? result[0] : undefined;
  }

  async getSessions(
    filter: Omit<SessionFilter, 'activeEvents'>,
    paging: Required<Paging>,
    orderBy?: SessionOrder,
    options: GetSessionsOptions = {},
  ): Promise<PagedSessions> {
    const { hostedBy, favouritedBy, votedBy, tracks, types, events, levels } = filter;
    const withSelect = this.sql`
      WITH
        hosted_sessions AS (SELECT session_id FROM hosts WHERE user_id = ${hostedBy ?? ''}),
        favourite_sessions AS (SELECT session_id FROM user_favourite_sessions WHERE user_id = ${favouritedBy ?? ''}),
        voted_sessions AS (SELECT session_id FROM votes WHERE user_id = ${votedBy ?? ''})
      `;

    const innerJoins = [
      hostedBy ? this.sql`INNER JOIN hosted_sessions ON hosted_sessions.session_id = sessions.id` : this.sql``,
      votedBy ? this.sql`INNER JOIN voted_sessions ON voted_sessions.session_id = sessions.id` : this.sql``,
      favouritedBy
        ? this.sql`INNER JOIN favourite_sessions ON favourite_sessions.session_id = sessions.id`
        : this.sql``,
    ];

    const where = [
      options.includeDrafts ? this.sql`WHERE true` : this.sql`WHERE sessions.event_id IS NOT NULL`,
      tracks ? this.sql`AND sessions_tracks.track_id IN ${this.sql(tracks)}` : this.sql``,
      types ? this.sql`AND sessions.type IN ${this.sql(types)}` : this.sql``,
      events ? this.sql`AND sessions.event_id IN ${this.sql(events)}` : this.sql``,
      levels ? this.sql`AND sessions.level IN ${this.sql(levels)}` : this.sql``,
    ];

    const opts = { includeFavouritesForUser: options.userId };

    const sessionQuery = this.sql<Session[]>`
      ${withSelect}
      ${this.select(opts)}
      ${this.from(opts)}
      ${innerJoins}
      ${where}
      GROUP BY sessions.id
      ${this.orderBy(orderBy)}
      LIMIT ${paging.limit}
      OFFSET ${paging.offset}
    `;

    const countQuery = this.sql<{ total: number }[]>`
      ${withSelect}
      SELECT COUNT(DISTINCT sessions.id) as total
      ${this.from(opts)}
      ${innerJoins}
      ${where}
    `;

    const [sessions, count] = await Promise.all([sessionQuery, countQuery]);

    return { ...paging, total: count[0]?.total ?? 0, sessions };
  }

  private orderBy = (orderBy?: SessionOrder) => {
    switch (orderBy) {
      case 'newest':
        return this.sql`ORDER BY sessions.created_at DESC`;
      case 'oldest':
        return this.sql`ORDER BY sessions.created_at ASC`;
      case 'votes':
        return this.sql`ORDER BY COUNT(DISTINCT votes.user_id) DESC`;
      case 'name':
      default: {
        return this.sql`ORDER BY sessions.name ASC`;
      }
    }
  };

  async createFavourite(userId: string, sessionId: string): Promise<void> {
    await this.sql`
      INSERT INTO user_favourite_sessions (user_id, session_id)
      VALUES (${userId}, ${sessionId})
      ON CONFLICT DO NOTHING
    `;
  }

  async deleteFavourite(userId: string, sessionId: string): Promise<void> {
    await this.sql`
        DELETE FROM user_favourite_sessions
        WHERE user_id = ${userId}
        AND session_id = ${sessionId}
    `;
  }

  async deleteSession(id: string): Promise<void> {
    await this.sql`
      DELETE FROM sessions
      WHERE id = ${id}
    `;
  }

  async removeEventIdFromSessionsNotInSchedule(eventId: string): Promise<void> {
    await this.sql`
    UPDATE sessions
    SET
      event_id = NULL
    WHERE id IN(
      SELECT sessions.id
      FROM sessions
      LEFT JOIN schedule_sessions ON schedule_sessions.session_id = sessions.id
      WHERE schedule_sessions.id IS NULL
      AND sessions.event_id = ${eventId}
    );
    `;
  }

  async editLinks(editLinks: EditLinks): Promise<Session> {
    const sessions = await this.sql<Session[]>`
    UPDATE sessions
    SET
      recording_url = ${editLinks.recordingUrl},
      slides_url = ${editLinks.slidesUrl},
      meeting_url = ${editLinks.meetingUrl},
      feedback_url = ${editLinks.feedbackUrl},
      updated_at = ${new Date()}
    WHERE sessions.id = ${editLinks.sessionId}
    RETURNING
      id,
      name,
      description,
      duration,
      recording_url AS "recordingUrl",
      slides_url AS "slidesUrl",
      meeting_url AS "meetingUrl",
      feedback_url AS "feedbackUrl",
      event_id AS "eventId",
      type,
      level,
      max_participants AS "maxParticipants",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
      `;
    if (!sessions[0]) {
      throw new NotFound('session not found');
    }

    return sessions[0];
  }

  readonly from = (options?: FetchOptions) => {
    const { includeHosts, includeVotes, includeTracks, includeFavouritesForUser } = {
      includeTracks: true,
      includeHosts: true,
      includeVotes: true,
      includeFavouritesForUser: null,
      ...(options ?? {}),
    };
    return this.sql`
      FROM sessions
      ${
        includeHosts
          ? this.sql`LEFT JOIN hosts ON hosts.session_id = sessions.id
                    LEFT JOIN users AS users_hosts ON users_hosts.id = hosts.user_id`
          : this.sql``
      }

      ${
        includeVotes
          ? this.sql`LEFT JOIN votes ON votes.session_id = sessions.id AND votes.event_id = sessions.event_id
                    LEFT JOIN users AS users_votes ON users_votes.id = votes.user_id`
          : this.sql``
      }

      ${
        includeTracks
          ? this.sql`LEFT JOIN sessions_tracks ON sessions_tracks.session_id = sessions.id
                    LEFT JOIN tracks ON tracks.id = sessions_tracks.track_id`
          : this.sql``
      }

      ${
        includeFavouritesForUser
          ? this.sql`LEFT JOIN user_favourite_sessions ON user_favourite_sessions.session_id = sessions.id`
          : this.sql``
      }`;
  };

  readonly select = (options?: FetchOptions) => {
    const { includeHosts, includeTracks, includeVotes, includeFavouritesForUser } = {
      includeTracks: true,
      includeHosts: true,
      includeVotes: true,
      includeFavouritesForUser: null,
      ...(options ?? {}),
    };

    return this.sql`
      SELECT
        sessions.id,
        sessions.name,
        sessions.description,
        sessions.type,
        sessions.level,
        sessions.duration,
        sessions.max_participants AS "maxParticipants",
        sessions.recording_url AS "recordingUrl",
        sessions.slides_url AS "slidesUrl",
        sessions.meeting_url AS "meetingUrl",
        sessions.feedback_url AS "feedbackUrl",
        sessions.event_id AS "eventId",
        sessions.created_at AS "createdAt",
        sessions.updated_at AS "updatedAt",
        sessions.created_from_session_id AS "createdFromSessionId",
        ${
          includeTracks
            ? this.sql`COALESCE
              (json_agg(DISTINCT jsonb_build_object(
                  'id', tracks.id,
                  'obsolete', tracks.obsolete,
                  'name', tracks.name,
                  'color', tracks.color)) FILTER (WHERE tracks.id IS NOT NULL), '[]')
              AS tracks,`
            : this.sql``
        }

          ${
            includeHosts
              ? this.sql`COALESCE
                  (json_agg(DISTINCT jsonb_build_object(
                      'id', users_hosts.id,
                      'email', users_hosts.email,
                      'name', users_hosts.name,
                      'photoUrl', users_hosts.photo_url)) FILTER (WHERE users_hosts.id IS NOT NULL), '[]')
                  AS hosts,`
              : this.sql``
          }

          ${
            includeVotes
              ? this.sql`COALESCE
                  (json_agg(DISTINCT jsonb_build_object(
                      'id', users_votes.id,
                      'email', users_votes.email,
                      'name', users_votes.name,
                      'photoUrl', users_votes.photo_url)) FILTER (WHERE users_votes.id IS NOT NULL), '[]')
                  AS voters,`
              : this.sql``
          }

        ${
          includeFavouritesForUser
            ? this.sql`
              EXISTS(
                SELECT 1
                FROM user_favourite_sessions
                WHERE user_favourite_sessions.user_id = ${includeFavouritesForUser}
                  AND user_favourite_sessions.session_id = sessions.id
              ) AS "favourite",`
            : this.sql``
        }
        (SELECT COUNT(*) FROM schedule_sessions WHERE schedule_sessions.session_id = sessions.id) > 0 AS "inSchedule"
      `;
  };
}

export default SessionRepo;
