import postgres from 'postgres';
import AuthService from '../pkg/auth/firebase';
import { randomBytes } from 'crypto';
import type { User } from '@competence-assistant/shared';

type CreateUserArgs = {
  email: string;
  name: string;
  password: string;
  admin: boolean;
};

export async function createUser(authService: AuthService, { name, email, password, admin }: CreateUserArgs) {
  const sql = postgres({
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
  });

  const id = randomBytes(16).toString('hex');

  await sql.begin(async (sql) => {
    const users = await sql<User[]>`
    INSERT INTO users(id, email, name, photo_url)
    VALUES(${id}, ${email}, ${name}, ${''})
    ON CONFLICT (email) DO
    UPDATE SET
      name = ${name}
    RETURNING
      id,
      email,
      name,
      photo_url AS "photoUrl"
    `;

    return authService.createUser({
      uid: users[0].id,
      displayName: users[0].name,
      email: users[0].email,
      password,
      admin,
    });
  });

  sql.end();

  return { email, password };
}
