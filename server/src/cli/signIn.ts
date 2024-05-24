import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export async function signIn(email: string, password: string) {
  const firebase = initializeApp({ apiKey: 'random', appId: 'random' });

  const auth = getAuth(firebase);
  connectAuthEmulator(auth, `http://${process.env.FIREBASE_AUTH_EMULATOR_HOST}`, { disableWarnings: true });
  const { user } = await signInWithEmailAndPassword(auth, email, password);

  return user.getIdToken();
}
