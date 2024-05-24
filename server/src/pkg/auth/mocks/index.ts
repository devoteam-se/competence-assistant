import AuthService from '../firebase';

jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn().mockReturnValue({
    auth: jest.fn().mockReturnValue({
      getUser: jest.fn(),
      verifyIdToken: jest.fn(),
      listUsers: jest.fn(),
      setCustomUserClaims: jest.fn(),
      createUser: jest.fn(),
    }),
  }),
}));

export const mkAuthService = jest.mocked(new AuthService());
