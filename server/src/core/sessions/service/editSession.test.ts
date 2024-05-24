import { EditSession, SessionLevelEnum, SessionTypeEnum, User, Session } from '@competence-assistant/shared';
import { mkTransaction } from '../../../pkg/db/mocks/Transaction';
import { Forbidden, NotFound } from '../../../pkg/error';
import { mkSessionRepo } from '../mocks/SessionRepo';
import { mkAuthService } from '../../../pkg/auth/mocks';
import SessionService from './service';
import { mkEventRepo } from '../../events/mocks/EventRepo';

describe('editSession', () => {
  const user: User = {
    id: 'user-id',
    email: 'user@example.com',
    name: 'User',
    photoUrl: '',
    admin: false,
  };
  const sessionService = new SessionService(mkSessionRepo, mkEventRepo, mkTransaction, mkAuthService);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Should throw Not Found Error if session does not exist', async () => {
    // given
    const editSession: EditSession = {
      id: 'session-id',
      name: 'K-day',
      description: 'example description',
      duration: 40,
      eventId: 'event-id',
      type: SessionTypeEnum.Session,
      level: SessionLevelEnum.Beginner,
      maxParticipants: null,
      tracks: [],
      hosts: [],
      recordingUrl: null,
      slidesUrl: null,
      meetingUrl: null,
      feedbackUrl: null,
      createdFromSessionId: null,
    };

    mkSessionRepo.getSession.mockResolvedValue(undefined);

    // when
    const promise = sessionService.editSession(editSession, 'user-id');

    // then
    await expect(promise).rejects.toThrow(new NotFound());
  });

  it('Should not allow editing past sessions', async () => {
    // given
    const existing: Session = {
      id: 'session-id',
      name: 'K-day',
      description: 'example description',
      duration: 40,
      eventId: 'event-id',
      type: SessionTypeEnum.Session,
      level: SessionLevelEnum.Beginner,
      maxParticipants: 10,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      recordingUrl: null,
      slidesUrl: null,
      meetingUrl: null,
      feedbackUrl: null,
      createdFromSessionId: null,
    };

    const edit: EditSession = {
      ...existing,
      hosts: [],
      tracks: [],
      name: 'New Name',
    };

    mkSessionRepo.getSession.mockResolvedValue(existing);
    mkSessionRepo.eventHasEnded.mockResolvedValue(true);

    // when
    const promise = sessionService.editSession(edit, user.id);

    // then
    await expect(promise).rejects.toThrow(new Forbidden('event has ended'));
  });

  it('Should not allow non-hosts to edit', async () => {
    // given
    const host = { id: 'host-id', email: 'host@example.com', name: 'Host', photoUrl: '', admin: false };
    const existing: Session = {
      id: 'session-id',
      name: 'K-day',
      description: 'example description',
      duration: 40,
      eventId: 'event-id',
      type: SessionTypeEnum.Session,
      level: SessionLevelEnum.Beginner,
      maxParticipants: 10,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      recordingUrl: null,
      slidesUrl: null,
      meetingUrl: null,
      feedbackUrl: null,
      createdFromSessionId: null,
      hosts: [host],
    };

    const edit: EditSession = {
      ...existing,
      hosts: [host.id],
      tracks: [],
      name: 'New Name',
    };

    mkSessionRepo.getSession.mockResolvedValue(existing);
    mkSessionRepo.getHostsForSession.mockResolvedValue([host]);
    mkAuthService.userIsAdmin = jest.fn().mockResolvedValue(false);

    // when
    const promise = sessionService.editSession(edit, user.id);

    // then
    await expect(promise).rejects.toThrow(new Forbidden('user not authorized to edit session'));
  });

  it('Should allow host to edit future session', async () => {
    // given
    const existing: Session = {
      id: 'session-id',
      name: 'K-day',
      description: 'example description',
      duration: 40,
      eventId: 'event-id',
      type: SessionTypeEnum.Session,
      level: SessionLevelEnum.Beginner,
      maxParticipants: 10,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      recordingUrl: null,
      slidesUrl: null,
      meetingUrl: null,
      feedbackUrl: null,
      createdFromSessionId: null,
    };

    const edit: EditSession = {
      ...existing,
      hosts: [],
      tracks: [],
      name: 'New Name',
    };

    mkSessionRepo.getSession.mockResolvedValue(existing);
    mkSessionRepo.getHostsForSession.mockResolvedValue([user]);

    // when
    await sessionService.editSession(edit, user.id);

    // then
    expect(mkSessionRepo.editSession).toHaveBeenCalledWith(edit);
  });

  it('Should allow admins to edit future session', async () => {
    // given
    const host = { id: 'host-id', email: 'host@example.com', name: 'Host', photoUrl: '', admin: false };
    const existing: Session = {
      id: 'session-id',
      name: 'K-day',
      description: 'example description',
      duration: 40,
      eventId: 'event-id',
      type: SessionTypeEnum.Session,
      level: SessionLevelEnum.Beginner,
      maxParticipants: 10,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      recordingUrl: null,
      slidesUrl: null,
      meetingUrl: null,
      feedbackUrl: null,
      createdFromSessionId: null,
      hosts: [host],
    };

    const edit: EditSession = {
      ...existing,
      hosts: [host.id],
      tracks: [],
      name: 'New Name',
    };

    mkSessionRepo.getSession.mockResolvedValue(existing);
    mkSessionRepo.getHostsForSession.mockResolvedValue([host]);
    mkAuthService.userIsAdmin = jest.fn().mockResolvedValue(true);

    // when
    await sessionService.editSession(edit, user.id);

    // then
    expect(mkSessionRepo.editSession).toHaveBeenCalledWith(edit);
  });

  it('Should replace hosts and tracks on edit', async () => {
    // given
    const existing: Session = {
      id: 'session-id',
      name: 'K-day',
      description: 'example description',
      duration: 40,
      eventId: 'event-id',
      type: SessionTypeEnum.Session,
      level: SessionLevelEnum.Beginner,
      maxParticipants: 10,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      recordingUrl: null,
      slidesUrl: null,
      meetingUrl: null,
      feedbackUrl: null,
      createdFromSessionId: null,
      hosts: [user],
    };

    const edit: EditSession = {
      ...existing,
      hosts: existing.hosts?.map(({ id }) => id) ?? [],
      tracks: [],
      name: 'New Name',
    };

    mkSessionRepo.getSession.mockResolvedValue(existing);
    mkSessionRepo.getHostsForSession.mockResolvedValue([user]);

    // when
    await sessionService.editSession(edit, user.id);

    // then
    expect(mkSessionRepo.deleteHosts).toHaveBeenCalledWith(existing.id);
    expect(mkSessionRepo.deleteTracks).toHaveBeenCalledWith(existing.id);
    expect(mkSessionRepo.addHosts).toHaveBeenCalledWith(edit.hosts, existing.id);
    expect(mkSessionRepo.addTracks).toHaveBeenCalledWith(edit.tracks, existing.id);
  });

  it('Should clear hosts votes for the edited session', async () => {
    // given
    const existing: Session = {
      id: 'session-id',
      name: 'K-day',
      description: 'example description',
      duration: 40,
      eventId: 'event-id',
      type: SessionTypeEnum.Session,
      level: SessionLevelEnum.Beginner,
      maxParticipants: 10,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      recordingUrl: null,
      slidesUrl: null,
      meetingUrl: null,
      feedbackUrl: null,
      createdFromSessionId: null,
      hosts: [user],
    };

    const edit: EditSession = {
      ...existing,
      hosts: [user.id, 'cohost-id'],
      tracks: [],
      name: 'New Name',
    };

    mkSessionRepo.getSession.mockResolvedValue(existing);
    mkSessionRepo.getHostsForSession.mockResolvedValue([user]);

    // when
    await sessionService.editSession(edit, user.id);

    // then
    expect(mkSessionRepo.deleteVote).toHaveBeenCalledTimes(2);
    expect(mkSessionRepo.deleteVote).toHaveBeenCalledWith({ userId: user.id, sessionId: existing.id });
    expect(mkSessionRepo.deleteVote).toHaveBeenCalledWith({ userId: 'cohost-id', sessionId: existing.id });
  });
});
