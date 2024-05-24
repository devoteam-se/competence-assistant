import postgres from 'postgres';

jest.mock('postgres');

export const sql = postgres();