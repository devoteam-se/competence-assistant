import {
  Vote,
  EditLinks,
  Session,
  User,
  PagedSessions,
  Paging,
  SessionFilter,
  SessionOrder,
} from '@competence-assistant/shared';
import { ITransaction } from '../../../pkg/db/transaction';
import { Forbidden, NotFound } from '../../../pkg/error';
import { ISessionService, ISessionRepo } from '../domain';

import { createSession } from './createSession';
import { editSession } from './editSession';
import { copySession } from './copySession';
import AuthService from '../../../pkg/auth/firebase';
import { IEventRepo } from '../../events/domain';

export default class SessionService implements ISessionService {
  constructor(
    public sessionRepo: ISessionRepo,
    private eventRepo: IEventRepo,
    public transaction: ITransaction,
    private authService: AuthService,
  ) {}

  public createSession = createSession;

  public editSession = editSession;

  public copySession = copySession;

  async createVote(newVote: Vote): Promise<Vote> {
    return this.sessionRepo.createVote(newVote);
  }

  async createFavourite(userId: string, sessionId: string): Promise<void> {
    return this.sessionRepo.createFavourite(userId, sessionId);
  }

  async deleteFavourite(userId: string, sessionId: string): Promise<void> {
    return this.sessionRepo.deleteFavourite(userId, sessionId);
  }

  async deleteVote(oldVote: Vote): Promise<void> {
    return this.sessionRepo.deleteVote(oldVote);
  }

  async getSession(id: string, userId: string | null): Promise<Session> {
    const session = await this.sessionRepo.getSession(id, userId);
    if (!session) {
      throw new NotFound();
    }
    return session;
  }

  async getSessions(
    { votable, ...filter }: SessionFilter,
    paging: Paging,
    orderBy?: SessionOrder,
    userId?: string | null,
  ): Promise<PagedSessions> {
    const { limit = 20, offset } = paging;
    const includeDrafts = !!filter.hostedBy && filter.hostedBy === userId;

    if (votable) {
      const { events } = await this.eventRepo.getEvents({ states: ['votable'] }, { limit: 100, offset: 0 });
      if (events.length === 0) return { sessions: [], total: 0, limit, offset };

      const votableEventIds = events.map(({ id }) => id);
      const requestedEventIds = filter.events ?? votableEventIds;
      filter = {
        ...filter,
        events: votableEventIds.filter((id) => requestedEventIds.includes(id)),
      };
    }

    return this.sessionRepo.getSessions(filter, { limit, offset }, orderBy, { includeDrafts, userId });
  }

  async userIsHostForSession(sessionId: string, userId: string): Promise<boolean> {
    const hostsForEvent: User[] = await this.sessionRepo.getHostsForSession(sessionId);

    const userInHosts = hostsForEvent.filter((host) => host.id === userId);
    return userInHosts.length > 0;
  }

  async canEdit(id: string, userId: string): Promise<boolean> {
    const userIsHost = await this.userIsHostForSession(id, userId);
    if (userIsHost) return true;

    return this.authService.userIsAdmin(userId);
  }

  async deleteSession(id: string, userId: string): Promise<void> {
    if (await this.sessionRepo.eventHasEnded(id)) {
      throw new Forbidden('event has ended');
    }
    const canDelete = await this.canEdit(id, userId);
    if (!canDelete) {
      throw new Forbidden('user not authorized to delete session');
    }

    return this.sessionRepo.deleteSession(id);
  }

  async editLinks(editLinks: EditLinks): Promise<Session> {
    return this.sessionRepo.editLinks(editLinks);
  }
}
