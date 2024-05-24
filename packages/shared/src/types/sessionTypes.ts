import { z } from 'zod';
import {
  EditLinksValidator,
  EditSessionValidator,
  SessionFilterValidator,
  NewSessionValidator,
  SessionValidator,
} from '../validators';
import type { Page } from './pagingTypes';

export type Session = z.infer<typeof SessionValidator>;
export type NewSession = z.infer<typeof NewSessionValidator>;
export type EditSession = z.infer<typeof EditSessionValidator>;
export type EditLinks = z.infer<typeof EditLinksValidator>;

export type SessionFilter = z.infer<typeof SessionFilterValidator>;
export type PagedSessions = Page & { sessions: Session[] };
