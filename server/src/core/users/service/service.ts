import { User } from '@competence-assistant/shared';
import { IUserRepo, IUserService } from '../domain';
import AuthService from '../../../pkg/auth/firebase';

export default class UserService implements IUserService {
  constructor(private userRepo: IUserRepo, private authService: AuthService) {}

  async getUsers(): Promise<User[]> {
    const result = await this.authService.listUsers();

    const users = result.users.map<User>((user) => ({
      id: user.uid,
      email: user.email || '',
      name: user.displayName || '',
      photoUrl: user.photoURL || '',
      admin: user.customClaims?.admin || false,
    }));

    return users;
  }

  async grantAdmin(userId: string): Promise<void> {
    this.authService.setCustomUserClaims(userId, { admin: true });
  }

  async revokeAdmin(userId: string): Promise<void> {
    this.authService.setCustomUserClaims(userId, {});
  }

  async upsertUser(user: User): Promise<void> {
    this.userRepo.upsertUser(user);
  }
}
