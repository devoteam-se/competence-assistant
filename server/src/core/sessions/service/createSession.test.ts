import {
  NewSession,
  SessionLevelEnum,
  SessionTrack,
  SessionTypeEnum,
  User,
  Session,
} from '@competence-assistant/shared';
import { mkTransaction } from '../../../pkg/db/mocks/Transaction';
import { mkSessionRepo } from '../mocks/SessionRepo';
import SessionService from './service';
import { mkAuthService } from '../../../pkg/auth/mocks';
import { mkEventRepo } from '../../events/mocks/EventRepo';

describe('createSession', () => {
  const sessionService = new SessionService(mkSessionRepo, mkEventRepo, mkTransaction, mkAuthService);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('happy', async () => {
    const user: User = { id: 'user-id', email: 'user@example.com', name: 'User', photoUrl: '', admin: false };
    const coHost: User = { id: 'cohost-id', email: 'cohost@example.com', name: 'CoHost', photoUrl: '', admin: false };
    const hosts = [user, coHost];
    const tracks: SessionTrack[] = [{ id: 'track-id', name: 'Test Track', color: '#HEXCOLOR', obsolete: false }];

    const newSession: NewSession = {
      name: 'K-day',
      description: 'example description',
      duration: 40,
      eventId: 'event-id',
      type: SessionTypeEnum.Session,
      level: SessionLevelEnum.Beginner,
      maxParticipants: null,
      tracks: tracks.map(({ id }) => id),
      hosts: hosts.map(({ id }) => id),
      recordingUrl: null,
      slidesUrl: null,
      meetingUrl: null,
      feedbackUrl: null,
      createdFromSessionId: null,
    };

    const session: Session = {
      id: 'session-id',
      name: newSession.name,
      description: newSession.description,
      duration: newSession.duration,
      eventId: 'event-id',
      type: newSession.type,
      level: newSession.level,
      maxParticipants: newSession.maxParticipants,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      recordingUrl: null,
      slidesUrl: null,
      meetingUrl: null,
      feedbackUrl: null,
      createdFromSessionId: null,
    };

    mkSessionRepo.createSession.mockResolvedValue(session);
    mkSessionRepo.addHosts.mockResolvedValue(hosts);
    mkSessionRepo.addTracks.mockResolvedValue(tracks);

    const result = await sessionService.createSession(newSession);

    expect(mkSessionRepo.createSession).toHaveBeenCalledTimes(1);
    expect(mkSessionRepo.createSession).toHaveBeenCalledWith(newSession);

    expect(mkSessionRepo.addHosts).toHaveBeenCalledTimes(1);
    expect(mkSessionRepo.addHosts).toHaveBeenCalledWith(
      hosts.map(({ id }) => id),
      session.id,
    );

    expect(mkSessionRepo.addTracks).toHaveBeenCalledTimes(1);
    expect(mkSessionRepo.addTracks).toHaveBeenCalledWith(
      tracks.map(({ id }) => id),
      session.id,
    );

    expect(result).toStrictEqual({
      ...session,
      hosts,
      tracks,
    });
  });
});
