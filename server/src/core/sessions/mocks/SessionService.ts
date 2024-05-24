import SessionService from '../service/service';
import { mkSessionRepo } from './SessionRepo';
import { mkTransaction } from '../../../pkg/db/mocks/Transaction';
import { mkAuthService } from '../../../pkg/auth/mocks';
import { mkEventRepo } from '../../events/mocks/EventRepo';

jest.mock('../service/service');

export const mkSessionService = jest.mocked(
  new SessionService(mkSessionRepo, mkEventRepo, mkTransaction, mkAuthService),
);
