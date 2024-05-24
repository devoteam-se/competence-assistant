import {
  NewSession,
  Vote,
  EditSession,
  EditLinks,
  Session,
  PagedSessions,
  SessionTrack,
  User,
  SessionFilter,
  Paging,
  SessionOrder,
} from '@competence-assistant/shared';

export type GetSessionsOptions = {
  includeDrafts?: boolean;
  userId?: string | null;
};

export interface ISessionRepo {
  addHosts(userId: string[], sessionId: string): Promise<User[]>;
  addTracks(trackIds: string[], sessionId: string): Promise<SessionTrack[]>;
  createFavourite(userId: string, sessionId: string): Promise<void>;
  createSession(newSession: NewSession): Promise<Session>;
  createVote(vote: Vote): Promise<Vote>;
  deleteFavourite(userId: string, sessionId: string): Promise<void>;
  deleteHosts(sessionId: string): Promise<void>;
  deleteSession(id: string): Promise<void>;
  deleteTracks(sessionId: string): Promise<void>;
  deleteVote(vote: Partial<Vote>): Promise<void>;
  editLinks(editLinks: EditLinks): Promise<Session>;
  editSession(session: EditSession): Promise<Session>;
  eventHasEnded(sessionId: string): Promise<boolean>;
  getHostsForSession(sessionId: string): Promise<User[]>;
  getSession(sessionId: string, userId: string | null): Promise<Session | undefined>;
  getTracksForSession(sessionId: string): Promise<SessionTrack[]>;
  getSessions(
    filter: SessionFilter,
    paging: Paging,
    orderBy?: SessionOrder,
    options?: GetSessionsOptions,
  ): Promise<PagedSessions>;
  removeEventIdFromSessionsNotInSchedule(eventId: string): Promise<void>;
  updateSessionEvent(sessionId: string, eventId: string | null): Promise<Session | undefined>;
}

export interface ISessionService {
  createFavourite(userId: string, sessionId: string): Promise<void>;
  createSession(newSession: NewSession, userId: string): Promise<Session>;
  createVote(newVote: Vote): Promise<Vote>;
  copySession(sessionId: string, userId: string): Promise<Session>;
  deleteFavourite(userId: string, sessionId: string): Promise<void>;
  deleteSession(id: string, userId: string): Promise<void>;
  deleteVote(oldVote: Vote): Promise<void>;
  editLinks(editLinks: EditLinks): Promise<Session>;
  editSession(editSession: EditSession, userId: string): Promise<Session>;
  getSession(id: string, userId: string | null): Promise<Session>;
  getSessions(
    filter: SessionFilter,
    paging: Paging,
    orderBy?: SessionOrder,
    userId?: string | null,
  ): Promise<PagedSessions>;
}
