import { NewSession, Session } from '@competence-assistant/shared';
import SessionService from './service';

export function createSession(this: SessionService, newSession: NewSession): Promise<Session> {
  return this.transaction.begin(async () => {
    const session = await this.sessionRepo.createSession(newSession);

    const [hosts, tracks] = await Promise.all([
      this.sessionRepo.addHosts(newSession.hosts, session.id),
      this.sessionRepo.addTracks(newSession.tracks, session.id),
    ]);

    return { ...session, hosts, tracks };
  });
}
