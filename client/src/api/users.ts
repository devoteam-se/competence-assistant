import { User } from '@competence-assistant/shared';
import { get, put } from './method';

export default {
  upsertUser: async () => {
    await put<void, undefined>('users/');
  },
  grantAdmin: async (userId: string) => {
    await put<void, undefined>(`/users/${userId}/grantAdmin`);
    return userId;
  },
  revokeAdmin: async (userId: string) => {
    await put<void, undefined>(`/users/${userId}/revokeAdmin`);
    return userId;
  },
  getUsers: async (): Promise<User[]> => {
    const res = await get<User[]>('users');
    return res;
  },
};
