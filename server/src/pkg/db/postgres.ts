import { Logger } from 'pino';
import postgres from 'postgres';

import { Config } from '../../app/config';

export const pgCodes = {
  UNIQUE_VIOLATION: '23505',
};

export const createDbConn = async (config: Config['postgres'], logger: Logger) => {
  const sql = postgres({ ...config });

  try {
    await sql`SELECT NOW()`;
  } catch (err) {
    logger.error(err);
    sql.end();
  }

  return sql;
};
