import { EditSession, Session } from '@competence-assistant/shared';
import { Forbidden, NotFound } from '../../../pkg/error';
import SessionService from './service';

export function editSession(this: SessionService, editSession: EditSession, userId: string): Promise<Session> {
  return this.transaction.begin(async () => {
    const storedSession = await this.sessionRepo.getSession(editSession.id, null);
    if (!storedSession) {
      throw new NotFound();
    }

    if (await this.sessionRepo.eventHasEnded(storedSession.id)) {
      throw new Forbidden('event has ended');
    }

    if (!(await this.canEdit(storedSession.id, userId))) {
      throw new Forbidden('user not authorized to edit session');
    }

    const [session] = await Promise.all([
      this.sessionRepo.editSession(editSession),
      this.sessionRepo.deleteHosts(editSession.id),
      this.sessionRepo.deleteTracks(editSession.id),
      ...editSession.hosts.map((host) => this.sessionRepo.deleteVote({ userId: host, sessionId: editSession.id })),
    ]);

    const [hosts, tracks] = await Promise.all([
      this.sessionRepo.addHosts(editSession.hosts, editSession.id),
      this.sessionRepo.addTracks(editSession.tracks, editSession.id),
    ]);

    return { ...session, hosts, tracks };
  });
}
