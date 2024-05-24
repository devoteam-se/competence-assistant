import { getAuth, getIdToken, onAuthStateChanged } from 'firebase/auth';

export default async () => {
  const auth = getAuth();
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (user) {
        getIdToken(user).then(
          (idToken) => {
            resolve(idToken);
          },
          (error) => {
            console.error(error);
            resolve(null);
          },
        );
      } else {
        resolve(null);
      }
    });
  });
};
