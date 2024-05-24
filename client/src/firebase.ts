import { initializeApp } from 'firebase/app';
import {
  browserLocalPersistence,
  browserPopupRedirectResolver,
  browserSessionPersistence,
  connectAuthEmulator,
  GoogleAuthProvider,
  indexedDBLocalPersistence,
  initializeAuth,
  signInWithPopup,
  type User,
} from 'firebase/auth';

import Api from './api';

export type AuthUser = User;
const app = initializeApp({
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
});

const auth = initializeAuth(app, {
  persistence: [indexedDBLocalPersistence, browserLocalPersistence, browserSessionPersistence],
  popupRedirectResolver: browserPopupRedirectResolver,
});

if (import.meta.env.MODE === 'development') {
  connectAuthEmulator(auth, import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_URL, { disableWarnings: true });
}

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account', hd: 'devoteam.com' });

const signIn = async () => {
  try {
    await signInWithPopup(auth, provider);
    await Api.upsertUser();
  } catch (err) {
    await auth.signOut();
    console.error(err);
  }
};

const signOut = async () => {
  try {
    await auth.signOut();
  } catch (err) {
    console.error(err);
  }
};

export const firebase = {
  signIn,
  signOut,
  auth,
};
