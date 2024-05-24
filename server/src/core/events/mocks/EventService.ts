import { mkTransaction } from '../../../pkg/db/mocks/Transaction';
import { mkSessionRepo } from '../../sessions/mocks/SessionRepo';
import EventService from '../service/service';
import { mkEventRepo } from './EventRepo';

jest.mock('../service/service');

export const mkEventService = jest.mocked(new EventService(mkEventRepo, mkSessionRepo, mkTransaction));
