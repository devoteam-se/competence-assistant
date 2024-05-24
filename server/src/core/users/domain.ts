import { User } from '@competence-assistant/shared';

export interface IUserRepo {
  upsertUser(user: User): Promise<void>;
}

export interface IUserService {
  getUsers(): Promise<User[]>;
  grantAdmin(userId: string): Promise<void>;
  revokeAdmin(userId: string): Promise<void>;
  upsertUser(user: User): Promise<void>;
}
