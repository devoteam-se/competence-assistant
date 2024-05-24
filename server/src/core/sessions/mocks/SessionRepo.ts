import { sql } from '../../../pkg/db/mocks/pg';
import SessionRepo from '../repo/postgres';

jest.mock('../repo/postgres');

export const mkSessionRepo = jest.mocked(new SessionRepo(sql));
