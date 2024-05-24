import { sql } from '../../../pkg/db/mocks/pg';
import EventRepo from '../repo/postgres';

jest.mock('../repo/postgres');

export const mkEventRepo = jest.mocked(new EventRepo(sql));
