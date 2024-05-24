import { Fn, ITransaction } from '../transaction';
import { sql } from './pg';

export const mkTransaction: ITransaction = {
  begin: <T>(fn: Fn<T>) => {
    return fn(sql);
  },
};
