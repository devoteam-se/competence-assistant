import SessionService from './service';
import { NewSessionValidator, Session, EditSession } from '@competence-assistant/shared';
import { NotFound } from '../../../pkg/error';

export function copySession(this: SessionService, sessionId: string, userId: string): Promise<Session> {
  return this.transaction.begin(async () => {
    const session = await this.sessionRepo.getSession(sessionId, null);

    if (!session) {
      throw new NotFound();
    }

    //our Postgres library returns undefined for null values, but zod requires null to parse it
    const newSession: EditSession = (await convertUndefinedToNull(session)) as unknown as EditSession;

    newSession['hosts'] = [userId];
    newSession['tracks'] = session.tracks ? session.tracks.map((track) => track.id) : [];
    newSession.createdFromSessionId = sessionId;

    return this.createSession(NewSessionValidator.parse(newSession));
  });
}
/* eslint-disable @typescript-eslint/no-explicit-any */
async function convertUndefinedToNull(obj: Record<string, any>) {
  const keys = Object.keys(obj);
  const promises = keys.map(async (key) => {
    if (obj[key] === undefined) {
      obj[key] = null;
    }
  });
  await Promise.all(promises);
  return obj;
}
