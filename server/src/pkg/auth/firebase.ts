import jwt from 'jsonwebtoken';
import * as admin from 'firebase-admin';

export default class AuthService {
  private auth: admin.auth.Auth;

  constructor() {
    const app = admin.initializeApp();
    this.auth = app.auth();
  }

  async verifyToken(token: string) {
    // Only decode token in dev so both emulator and prod token can be used
    if (process.env.NODE_ENV == 'development') {
      return jwt.decode(token, { json: true });
    }
    return this.auth.verifyIdToken(token);
  }

  async listUsers() {
    return this.auth.listUsers();
  }

  async userIsAdmin(userId: string) {
    const { customClaims } = await this.auth.getUser(userId);
    return customClaims?.admin || false;
  }

  async setCustomUserClaims(userId: string, claims: Record<string, unknown>) {
    return this.auth.setCustomUserClaims(userId, claims);
  }

  async createUser({ admin, ...user }: admin.auth.CreateRequest & { admin?: boolean }) {
    const created = await this.auth.createUser(user);
    if (admin) {
      await this.setCustomUserClaims(created.uid, { admin });
    }
    return created;
  }
}
