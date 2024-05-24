import { EventWithUniqueVoters, Session, SessionOrder } from '@competence-assistant/shared';
import { mkAuthService } from '../../../pkg/auth/mocks';
import { mkTransaction } from '../../../pkg/db/mocks/Transaction';
import { mkEventRepo } from '../../events/mocks/EventRepo';
import { mkSessionRepo } from '../mocks/SessionRepo';
import SessionService from './service';
import { NotFound } from '../../../pkg/error';

describe('SessionService', () => {
  const service = new SessionService(mkSessionRepo, mkEventRepo, mkTransaction, mkAuthService);

  describe('getSession', () => {
    it('should fetch session by id', async () => {
      // given
      const session = { id: '1' } as Session;
      mkSessionRepo.getSession.mockResolvedValue(session);

      // when
      const result = await service.getSession('1', null);

      // then
      expect(result).toEqual(session);
      expect(mkSessionRepo.getSession).toHaveBeenCalledWith('1', null);
    });

    it('should throw NotFound if session not found', async () => {
      // given
      mkSessionRepo.getSession.mockResolvedValue(undefined);

      // when
      const promise = service.getSession('1', null);

      // then
      await expect(promise).rejects.toThrow(NotFound);
    });
  });

  describe('getSessions', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return paged', async () => {
      // given
      const page = { total: 1, limit: 1, offset: 0 };
      const sessions = [{ id: '1' } as Session];

      mkSessionRepo.getSessions.mockResolvedValue({ ...page, sessions });

      // when
      const result = await service.getSessions({}, { offset: 0 });

      // then
      expect(result).toEqual({ ...page, sessions });
    });

    it('should fetch default page size of 20', async () => {
      // given
      const expFilter = {};
      const expPaging = { limit: 20, offset: 0 };
      const expOrder = undefined;
      const expOpts = { includeDrafts: false };
      // given, when
      await service.getSessions({}, { offset: 0 });

      // then
      expect(mkSessionRepo.getSessions).toHaveBeenCalledWith(expFilter, expPaging, expOrder, expOpts);
    });

    it('should include drafts when filtering by host and the requested host is the current user', async () => {
      // given
      const currentUserId = '1';
      const filter = { hostedBy: currentUserId };
      const expOpts = { includeDrafts: true, userId: currentUserId };

      // when
      await service.getSessions(filter, { offset: 0 }, undefined, currentUserId);

      // then
      expect(mkSessionRepo.getSessions).toHaveBeenCalledWith(filter, expect.anything(), undefined, expOpts);
    });

    it('should not include drafts when filtering by host and the requested host is not the current user', async () => {
      // given
      const currentUserId = '1';
      const filter = { hostedBy: '2' };
      const expOpts = { includeDrafts: false, userId: currentUserId };

      // when
      await service.getSessions(filter, { offset: 0 }, undefined, currentUserId);

      // then
      expect(mkSessionRepo.getSessions).toHaveBeenCalledWith(filter, expect.anything(), undefined, expOpts);
    });

    it('should filter by votable event ids', async () => {
      // given
      const filter = { votable: true };
      const events = [{ id: '1' } as EventWithUniqueVoters];
      mkEventRepo.getEvents.mockResolvedValue({ events, total: 1, limit: 1, offset: 0 });

      // when
      await service.getSessions(filter, { offset: 0 });

      // then
      expect(mkSessionRepo.getSessions).toHaveBeenCalledWith(
        { events: ['1'] },
        expect.anything(),
        undefined,
        expect.anything(),
      );
    });

    it('should allow narrowing down session filter to only include specific votable events', async () => {
      // given
      const filter = { events: ['2'], votable: true };
      const votableEvents = [{ id: '1' }, { id: '2' }] as EventWithUniqueVoters[];
      mkEventRepo.getEvents.mockResolvedValue({ events: votableEvents, total: 1, limit: 1, offset: 0 });

      // when
      await service.getSessions(filter, { offset: 0 });

      // then
      expect(mkSessionRepo.getSessions).toHaveBeenCalledWith(
        { events: ['2'] },
        expect.anything(),
        undefined,
        expect.anything(),
      );
    });

    it('should pass on orderBy', async () => {
      // given
      const orderBy = SessionOrder.Votes;

      // when
      await service.getSessions({}, { offset: 0 }, orderBy);

      // then
      expect(mkSessionRepo.getSessions).toHaveBeenCalledWith({}, expect.anything(), orderBy, expect.anything());
    });
  });
});
