import { Sql } from 'postgres';

export type Fn<T> = (sql: Sql) => Promise<T>;
export interface ITransaction {
  begin<T>(fn: Fn<T>): Promise<T>;
}
export default class Transaction implements ITransaction {
  constructor(private sql: Sql) {}

  async begin<T>(fn: Fn<T>) {
    return this.sql.begin<Promise<T>>((sql) => {
      return fn(sql);
    });
  }
}
