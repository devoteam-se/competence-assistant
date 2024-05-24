import {
  EditSession,
  Favourite,
  NewSession,
  Session,
  SessionOrder,
  PagedSessions,
  Track,
  Vote,
  SessionFilter,
  Paging,
} from '@competence-assistant/shared';
import { _delete, get, post, put } from './method';
import { toQueryString } from '@/utils/querystring';

export type SessionsQueryOptions = {
  orderBy?: SessionOrder;
  paging?: Paging;
  filter?: SessionFilter;
};

export default {
  createSession: async (newSession: NewSession) => {
    const res = await post<Session, NewSession>('sessions', newSession);

    if (res) {
      return { ...res, voters: [] }; // Backend returns undefined voters.
    }
    return res;
  },
  editSession: async (session: EditSession) => {
    const res = await put<Session, EditSession>(`sessions/${session.id}`, session);

    if (res) {
      return { ...res, voters: [] }; // Backend returns undefined voters.
    }
    return res;
  },
  removeSession: async (sessionId: Session['id']) => {
    const res = await _delete(`sessions/${sessionId}`);
    return res;
  },
  getTracks: async () => {
    const res = await get<Track[]>('sessions/tracks');
    return res;
  },
  getSessions: async (options: SessionsQueryOptions): Promise<PagedSessions> => {
    const query = toQueryString(options);
    return get<PagedSessions>(`sessions?${query}`);
  },
  getSession: async (id: string): Promise<Session> => {
    const res = await get<Session>(`sessions/${id}`);
    return res;
  },
  vote: async (vote: Omit<Vote, 'userId'>) => {
    const res = await post<Vote, Omit<Vote, 'userId'>>('sessions/vote', vote);
    return res;
  },
  removeVote: async (vote: Omit<Vote, 'userId'>) => {
    const res = await _delete('sessions/vote', vote);
    return res;
  },
  addFavourite: async (favourite: Favourite) => {
    return post('sessions/favourite', { sessionId: favourite.sessionId });
  },
  removeFavourite: async (favourite: Favourite) => {
    return _delete('sessions/favourite', { sessionId: favourite.sessionId });
  },
};
