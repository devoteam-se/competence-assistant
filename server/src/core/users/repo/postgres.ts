import { User } from '@competence-assistant/shared';
import { Sql } from 'postgres';

import { IUserRepo } from '../domain';

class UserRepo implements IUserRepo {
  constructor(private sql: Sql) {}

  async upsertUser(user: User): Promise<void> {
    await this.sql`
    INSERT INTO users(id, email, name, photo_url)
    VALUES(${user.id}, ${user.email}, ${user.name}, ${user.photoUrl})
    ON CONFLICT (id) DO
    UPDATE SET 
      email = ${user.email},
      name = ${user.name},
      photo_url = ${user.photoUrl}
    `;
  }
}

export default UserRepo;
